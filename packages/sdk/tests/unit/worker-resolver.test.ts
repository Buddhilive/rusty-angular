import { describe, it, expect, vi } from 'vitest';
import { interceptRequire } from '../../src/worker/shims/addon-interceptor.js';

describe('Worker Resolver & Scoped Package Tests (T007)', () => {
  it('intercepts better-sqlite3 and provides in-memory database operations', () => {
    const Database = interceptRequire('better-sqlite3') as any;
    expect(Database).toBeDefined();

    const db = new Database('test.db');
    expect(db).toBeDefined();
    expect(db.filename).toBe('test.db');

    // Test prepare and run
    const stmt = db.prepare('INSERT INTO users (name) VALUES (?)');
    const result = stmt.run('Alice');
    expect(result.changes).toBe(1);
    expect(result.lastInsertRowid).toBe(1);

    // Test get
    const selectStmt = db.prepare('SELECT * FROM users WHERE id = ?');
    const user = selectStmt.get(1);
    expect(user).toBeDefined();
    expect(user.id).toBe(1);

    // Test all
    const allUsers = selectStmt.all();
    expect(Array.isArray(allUsers)).toBe(true);
    expect(allUsers.length).toBeGreaterThan(0);

    // Test close and exec
    expect(() => db.exec('CREATE TABLE users (id INT)')).not.toThrow();
    expect(() => db.close()).not.toThrow();
    expect(db.open).toBe(false);
  });

  it('intercepts native sqlite3 binding similarly', () => {
    const Database = interceptRequire('sqlite3') as any;
    expect(Database).toBeDefined();
    const db = new Database(':memory:');
    expect(db.filename).toBe(':memory:');
  });

  it('resolves exports map condition order preferring require over default and import', () => {
    // Test the pure exports resolution logic
    const resolveExportTarget = (exportVal: any): string | null => {
      if (typeof exportVal === 'string') return exportVal;
      if (!exportVal || typeof exportVal !== 'object') return null;
      if (exportVal.require) return resolveExportTarget(exportVal.require);
      if (exportVal.default) return resolveExportTarget(exportVal.default);
      if (exportVal.import) return resolveExportTarget(exportVal.import);
      if (exportVal.node) return resolveExportTarget(exportVal.node);
      if (Array.isArray(exportVal)) {
        for (const item of exportVal) {
          const res = resolveExportTarget(item);
          if (res) return res;
        }
      }
      return null;
    };

    const pkgExports = {
      '.': {
        require: './dist/index.cjs',
        import: './dist/index.mjs',
        default: './dist/index.js',
      },
      './wasm': {
        require: './dist/wasm/index.cjs',
        import: './dist/wasm/index.mjs',
      },
      './sqlite-core': {
        default: './dist/sqlite-core/index.js',
        import: './dist/sqlite-core/index.mjs',
      },
    };

    expect(resolveExportTarget(pkgExports['.'])).toBe('./dist/index.cjs');
    expect(resolveExportTarget(pkgExports['./wasm'])).toBe('./dist/wasm/index.cjs');
    expect(resolveExportTarget(pkgExports['./sqlite-core'])).toBe('./dist/sqlite-core/index.js');
  });

  it('correctly splits scoped packages for directory creation', () => {
    const getScope = (pkgName: string): string | null => {
      if (pkgName.startsWith('@') && pkgName.includes('/')) {
        return pkgName.split('/')[0];
      }
      return null;
    };

    expect(getScope('@libsql/client')).toBe('@libsql');
    expect(getScope('@ai-sdk/openai')).toBe('@ai-sdk');
    expect(getScope('zustand')).toBeNull();
    expect(getScope('better-auth')).toBeNull();
  });
});

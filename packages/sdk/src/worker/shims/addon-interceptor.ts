/**
 * Synchronous Native Addon and SWC Interception for Next.js in the browser
 */

type AddonFactory = () => any;

const addonRegistry = new Map<string | RegExp, AddonFactory>();

// Fast pure-JS fallback transpiler for basic JSX/TS if toolchain WASM is still compiling/loading
function simpleJsxTransform(src: string): string {
  // Strip TypeScript types and simple JSX annotations if needed
  return src
    .replace(/: [A-Z][a-zA-Z0-9<>\[\]| &]*/g, '')
    .replace(/<([A-Za-z0-9_]+)([^>]*)>(.*?)<\/\1>/gs, (_, tag, attrs, children) => {
      return `React.createElement("${tag}", null, "${children.trim()}")`;
    });
}

// Default SWC transform shim
let customSwcTransformer: ((src: string, options?: any) => { code: string; map?: string }) | null = null;

export function setCustomSwcTransformer(fn: (src: string, options?: any) => { code: string; map?: string }) {
  customSwcTransformer = fn;
}

const defaultSwcShim = {
  isWasm: () => true,
  transformSync(src: string, options?: any) {
    if (customSwcTransformer) {
      return customSwcTransformer(src, options);
    }
    return { code: src, map: '{}' };
  },
  async transform(src: string, options?: any) {
    return this.transformSync(src, options);
  },
  minifySync(src: string, options?: any) {
    return { code: src, map: '{}' };
  },
  async minify(src: string, options?: any) {
    return { code: src, map: '{}' };
  },
  parseSync(src: string, options?: any) {
    return { type: 'Program', body: [], comments: [] };
  },
  async parse(src: string, options?: any) {
    return this.parseSync(src, options);
  },
  initSwc: async () => {},
};

export function registerAddonShim(pattern: string | RegExp, factory: AddonFactory): void {
  addonRegistry.set(pattern, factory);
}

export function interceptRequire(moduleName: string): any | null {
  // 1. Check for @next/swc
  if (
    moduleName.startsWith('@next/swc') ||
    moduleName.includes('@next/swc') ||
    moduleName.endsWith('next-swc.node')
  ) {
    return defaultSwcShim;
  }

  // 1.1 Check for next/font
  if (moduleName.startsWith('next/font') || moduleName.startsWith('@next/font')) {
    return {
      Inter: (opts?: any) => ({ className: '__font_inter', variable: '--font-inter', style: { fontFamily: 'Inter, sans-serif' } }),
      Roboto: (opts?: any) => ({ className: '__font_roboto', variable: '--font-roboto', style: { fontFamily: 'Roboto, sans-serif' } }),
      Geist: (opts?: any) => ({ className: '__font_geist', variable: '--font-geist', style: { fontFamily: 'Geist, sans-serif' } }),
      GeistMono: (opts?: any) => ({ className: '__font_geist_mono', variable: '--font-geist-mono', style: { fontFamily: 'monospace' } }),
      default: (opts?: any) => ({ className: '__font_custom', variable: '--font-custom', style: { fontFamily: 'sans-serif' } }),
    };
  }

  // 2. Check for better-sqlite3 or sqlite native bindings
  if (
    moduleName === 'better-sqlite3' ||
    moduleName === 'sqlite3' ||
    moduleName.endsWith('better_sqlite3.node')
  ) {
    const custom = addonRegistry.get('better-sqlite3');
    if (custom) return custom();

    console.warn(
      '[Sandbox] Native SQLite (better-sqlite3) intercepted. Using in-memory fallback. For full persistent SQLite support, use @libsql/client in WASM mode.'
    );

    const DatabaseClass: any = class Database {
      private memoryStore = new Map<string, any[]>();
      public open = true;
      public filename: string;

      constructor(filename: string, options?: any) {
        this.filename = filename || ':memory:';
      }

      prepare(sql: string) {
        const cleanSql = sql.trim();
        const self = this;
        return {
          run: (...params: any[]) => {
            const tableMatch = cleanSql.match(/into\s+([a-zA-Z0-9_]+)/i);
            const tableName = tableMatch ? tableMatch[1].toLowerCase() : 'default';
            if (!self.memoryStore.has(tableName)) {
              self.memoryStore.set(tableName, []);
            }
            const rows = self.memoryStore.get(tableName)!;
            const newId = rows.length + 1;
            rows.push({ id: newId, params, created_at: Date.now() });
            return { changes: 1, lastInsertRowid: newId };
          },
          get: (...params: any[]) => {
            const tableMatch = cleanSql.match(/from\s+([a-zA-Z0-9_]+)/i);
            const tableName = tableMatch ? tableMatch[1].toLowerCase() : 'default';
            const rows = self.memoryStore.get(tableName) || [];
            return rows[0] || { id: 1, status: 'ok' };
          },
          all: (...params: any[]) => {
            const tableMatch = cleanSql.match(/from\s+([a-zA-Z0-9_]+)/i);
            const tableName = tableMatch ? tableMatch[1].toLowerCase() : 'default';
            return self.memoryStore.get(tableName) || [];
          },
          iterate: function* (...params: any[]) {
            const tableMatch = cleanSql.match(/from\s+([a-zA-Z0-9_]+)/i);
            const tableName = tableMatch ? tableMatch[1].toLowerCase() : 'default';
            const rows = self.memoryStore.get(tableName) || [];
            for (const row of rows) yield row;
          },
        };
      }

      exec(sql: string) {
        return this;
      }

      pragma(pragmaStr: string) {
        return [];
      }

      transaction(fn: (...args: any[]) => any) {
        return (...args: any[]) => fn(...args);
      }

      close() {
        this.open = false;
      }
    };

    const factory: any = function (filename: string, opts?: any) {
      return new DatabaseClass(filename, opts);
    };
    factory.Database = DatabaseClass;
    Object.setPrototypeOf(factory, DatabaseClass);
    return factory;
  }

  // 3. Check registered patterns
  for (const [pattern, factory] of addonRegistry.entries()) {
    if (typeof pattern === 'string' && pattern === moduleName) {
      return factory();
    }
    if (pattern instanceof RegExp && pattern.test(moduleName)) {
      return factory();
    }
  }

  return null;
}

export default {
  registerAddonShim,
  interceptRequire,
  setCustomSwcTransformer,
};

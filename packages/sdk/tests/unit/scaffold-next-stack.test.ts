import { describe, it, expect } from 'vitest';
import { scaffoldNextStackApp } from '../../src/scaffold-next-stack.js';

describe('scaffoldNextStackApp Unit Tests (T022)', () => {
  it('creates all 16 canonical stack configuration and starter files', async () => {
    const writtenFiles = new Map<string, string>();
    const createdDirs = new Set<string>();

    const mockSandbox: any = {
      fs: {
        mkdir: async (path: string) => {
          createdDirs.add(path);
        },
        writeFile: async (path: string, content: string | Uint8Array) => {
          writtenFiles.set(path, typeof content === 'string' ? content : new TextDecoder().decode(content));
        },
      },
    };

    await scaffoldNextStackApp(mockSandbox, {
      appName: 'test-app',
      withAuth: true,
      withAI: true,
    });

    // Check essential directories
    expect(createdDirs.has('/workspace')).toBe(true);
    expect(createdDirs.has('/workspace/app')).toBe(true);
    expect(createdDirs.has('/workspace/db')).toBe(true);
    expect(createdDirs.has('/workspace/store')).toBe(true);
    expect(createdDirs.has('/workspace/components/ui')).toBe(true);

    // Check configuration files
    expect(writtenFiles.has('/workspace/package.json')).toBe(true);
    const pkg = JSON.parse(writtenFiles.get('/workspace/package.json')!);
    expect(pkg.name).toBe('test-app');
    expect(pkg.dependencies['next']).toBeDefined();
    expect(pkg.dependencies['tailwindcss']).toBeDefined();
    expect(pkg.dependencies['zustand']).toBeDefined();
    expect(pkg.dependencies['drizzle-orm']).toBeDefined();
    expect(pkg.dependencies['@libsql/client']).toBeDefined();
    expect(pkg.dependencies['better-auth']).toBeDefined();
    expect(pkg.dependencies['ai']).toBeDefined();

    expect(writtenFiles.has('/workspace/tsconfig.json')).toBe(true);
    expect(writtenFiles.has('/workspace/next.config.ts')).toBe(true);
    expect(writtenFiles.has('/workspace/postcss.config.mjs')).toBe(true);
    expect(writtenFiles.has('/workspace/tailwind.config.ts')).toBe(true);
    expect(writtenFiles.has('/workspace/components.json')).toBe(true);
    expect(writtenFiles.has('/workspace/lib/utils.ts')).toBe(true);
    expect(writtenFiles.has('/workspace/components/ui/button.tsx')).toBe(true);

    // Check database & auth
    expect(writtenFiles.has('/workspace/drizzle.config.ts')).toBe(true);
    expect(writtenFiles.has('/workspace/db/schema.ts')).toBe(true);
    expect(writtenFiles.has('/workspace/db/index.ts')).toBe(true);
    expect(writtenFiles.has('/workspace/auth.ts')).toBe(true);
    expect(writtenFiles.has('/workspace/lib/auth-client.ts')).toBe(true);

    // Check state & app router pages
    expect(writtenFiles.has('/workspace/store/use-app-store.ts')).toBe(true);
    expect(writtenFiles.has('/workspace/app/globals.css')).toBe(true);
    expect(writtenFiles.has('/workspace/app/layout.tsx')).toBe(true);
    expect(writtenFiles.has('/workspace/app/page.tsx')).toBe(true);
    expect(writtenFiles.has('/workspace/app/api/chat/route.ts')).toBe(true);
    expect(writtenFiles.has('/workspace/app/api/auth/[...all]/route.ts')).toBe(true);
  });
});

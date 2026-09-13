import type { Sandbox } from './sandbox.js';

export interface ScaffoldNextStackOptions {
  appName?: string;
  withAuth?: boolean;
  withAI?: boolean;
}

export async function scaffoldNextStackApp(
  sandbox: Sandbox,
  options: ScaffoldNextStackOptions = {}
): Promise<void> {
  const appName = options.appName || 'buddhi-next-app';
  const withAuth = options.withAuth ?? true;
  const withAI = options.withAI ?? true;
  const fs = sandbox.fs;

  // Ensure directories
  await fs.mkdir('/workspace', { recursive: true });
  await fs.mkdir('/workspace/app', { recursive: true });
  await fs.mkdir('/workspace/app/api', { recursive: true });
  if (withAI) {
    await fs.mkdir('/workspace/app/api/chat', { recursive: true });
  }
  if (withAuth) {
    await fs.mkdir('/workspace/app/api/auth/[...all]', { recursive: true });
  }
  await fs.mkdir('/workspace/db', { recursive: true });
  await fs.mkdir('/workspace/lib', { recursive: true });
  await fs.mkdir('/workspace/store', { recursive: true });
  await fs.mkdir('/workspace/components', { recursive: true });
  await fs.mkdir('/workspace/components/ui', { recursive: true });

  // 1. package.json
  const packageJson = {
    name: appName,
    version: '0.1.0',
    private: true,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint',
      'db:push': 'drizzle-kit push',
      'db:generate': 'drizzle-kit generate',
    },
    dependencies: {
      next: '^16.0.0',
      react: '^19.0.0',
      'react-dom': '^19.0.0',
      tailwindcss: '^4.0.0',
      '@tailwindcss/postcss': '^4.0.0',
      postcss: '^8.4.38',
      'clsx': '^2.1.1',
      'tailwind-merge': '^3.0.0',
      'class-variance-authority': '^0.7.1',
      'lucide-react': '^1.16.0',
      '@radix-ui/react-slot': '^1.1.2',
      zustand: '^5.0.0',
      'drizzle-orm': '^0.38.0',
      '@libsql/client': '^0.14.0',
      ...(withAuth ? { 'better-auth': '^1.1.0' } : {}),
      ...(withAI
        ? {
            ai: '^6.0.0',
            '@ai-sdk/openai': '^1.1.0',
            'ai-elements': '^0.1.0',
          }
        : {}),
    },
    devDependencies: {
      typescript: '^5.7.0',
      '@types/node': '^20.12.0',
      '@types/react': '^19.0.0',
      '@types/react-dom': '^19.0.0',
      'drizzle-kit': '^0.30.0',
    },
  };
  await fs.writeFile('/workspace/package.json', JSON.stringify(packageJson, null, 2));

  // 2. tsconfig.json
  const tsconfig = {
    compilerOptions: {
      target: 'ES2022',
      lib: ['dom', 'dom.iterable', 'esnext'],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      module: 'esnext',
      moduleResolution: 'bundler',
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: 'preserve',
      incremental: true,
      plugins: [{ name: 'next' }],
      paths: {
        '@/*': ['./*'],
      },
    },
    include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
    exclude: ['node_modules'],
  };
  await fs.writeFile('/workspace/tsconfig.json', JSON.stringify(tsconfig, null, 2));

  // 3. next.config.ts
  const nextConfig = `import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {},
  serverExternalPackages: ['@libsql/client'],
};

export default nextConfig;
`;
  await fs.writeFile('/workspace/next.config.ts', nextConfig);

  // 4. postcss.config.mjs
  const postcssConfig = `export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
`;
  await fs.writeFile('/workspace/postcss.config.mjs', postcssConfig);

  // 5. tailwind.config.ts
  const tailwindConfig = `import type { Config } from 'tailwindcss';

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
} satisfies Config;
`;
  await fs.writeFile('/workspace/tailwind.config.ts', tailwindConfig);

  // 6. components.json
  const componentsJson = {
    $schema: 'https://ui.shadcn.com/schema.json',
    style: 'default',
    rsc: true,
    tsx: true,
    tailwind: {
      config: 'tailwind.config.ts',
      css: 'app/globals.css',
      baseColor: 'zinc',
      cssVariables: true,
    },
    aliases: {
      components: '@/components',
      utils: '@/lib/utils',
      ui: '@/components/ui',
      lib: '@/lib',
      hooks: '@/hooks',
    },
  };
  await fs.writeFile('/workspace/components.json', JSON.stringify(componentsJson, null, 2));

  // 7. lib/utils.ts
  const utilsTs = `import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;
  await fs.writeFile('/workspace/lib/utils.ts', utilsTs);

  // 8. components/ui/button.tsx
  const buttonTsx = `import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
`;
  await fs.writeFile('/workspace/components/ui/button.tsx', buttonTsx);

  // 9. drizzle.config.ts
  const drizzleConfig = `import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'file:sqlite.db',
  },
});
`;
  await fs.writeFile('/workspace/drizzle.config.ts', drizzleConfig);

  // 10. db/schema.ts
  const dbSchema = `import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const items = sqliteTable('items', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});
`;
  await fs.writeFile('/workspace/db/schema.ts', dbSchema);

  // 11. db/index.ts
  const dbIndex = `import { createClient } from '@libsql/client/wasm';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

const client = createClient({
  url: process.env.DATABASE_URL || 'file:sqlite.db',
});

export const db = drizzle(client, { schema });
`;
  await fs.writeFile('/workspace/db/index.ts', dbIndex);

  // 12. store/use-app-store.ts
  const appStore = `import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface AppState {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        theme: 'system',
        sidebarOpen: true,
        setTheme: (theme) => set({ theme }),
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      }),
      { name: 'app-storage' }
    )
  )
);
`;
  await fs.writeFile('/workspace/store/use-app-store.ts', appStore);

  // 13. auth.ts & lib/auth-client.ts
  if (withAuth) {
    const authTs = `import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/db';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
  }),
  emailAndPassword: {
    enabled: true,
  },
});
`;
    await fs.writeFile('/workspace/auth.ts', authTs);

    const authClientTs = `import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: typeof window !== 'undefined' ? window.location.origin : '',
});

export const { signIn, signUp, signOut, useSession } = authClient;
`;
    await fs.writeFile('/workspace/lib/auth-client.ts', authClientTs);

    const authRouteTs = `import { auth } from '@/auth';
import { toNextJsHandler } from 'better-auth/next-js';

export const { GET, POST } = toNextJsHandler(auth);
`;
    await fs.writeFile('/workspace/app/api/auth/[...all]/route.ts', authRouteTs);
  }

  // 14. app/globals.css
  const globalsCss = `@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
  --color-primary-foreground: #ffffff;
  --color-background: #ffffff;
  --color-foreground: #09090b;
  --color-muted: #f4f4f5;
  --color-muted-foreground: #71717a;
  --color-border: #e4e4e7;
  --color-input: #e4e4e7;
}

@layer base {
  body {
    background-color: var(--color-background);
    color: var(--color-foreground);
  }
}
`;
  await fs.writeFile('/workspace/app/globals.css', globalsCss);

  // 15. app/layout.tsx
  const layoutTsx = `import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '${appName}',
  description: 'Built with Buddhi AI Next.js opinionated stack',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`;
  await fs.writeFile('/workspace/app/layout.tsx', layoutTsx);

  // 16. app/page.tsx
  const pageTsx = `'use client';

import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/use-app-store';

export default function Home() {
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background text-foreground">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to ${appName}
        </h1>
        <p className="text-sm text-muted-foreground">
          Next.js 16 • TailwindCSS v4 • Shadcn • Zustand • Drizzle • SQLite
        </p>
        <div className="flex justify-center gap-3 pt-4">
          <Button onClick={toggleSidebar}>
            Toggle Store ({sidebarOpen ? 'Open' : 'Closed'})
          </Button>
          <Button variant="outline">Learn More</Button>
        </div>
      </div>
    </main>
  );
}
`;
  await fs.writeFile('/workspace/app/page.tsx', pageTsx);

  // 17. app/api/chat/route.ts
  if (withAI) {
    const chatRouteTs = `import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o-mini'),
    messages,
  });

  return result.toDataStreamResponse();
}
`;
    await fs.writeFile('/workspace/app/api/chat/route.ts', chatRouteTs);
  }
}

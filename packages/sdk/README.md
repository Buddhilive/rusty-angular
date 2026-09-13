# @buddhilive/sandbox

> Ultra-lightweight, zero-backend, client-side Node.js sandbox running entirely in WebAssembly & Web Workers.

## Features

- ⚡ **Zero Backend**: Runs 100% in the user's browser using WebAssembly and dedicated Web Workers.
- 📁 **In-Memory POSIX VirtualFS**: Synchronous and asynchronous filesystem APIs (`readFile`, `writeFile`, `mkdir`, `readdir`, `stat`, `symlink`).
- 🌐 **In-Browser Web Application Previews**: Intercepts HTTP/TCP listeners (`http.createServer().listen(3000)`) via Service Worker and renders them live at `/__preview/:port/` inside `<iframe>` tags.
- 📦 **Client-Side NPM Package Installer**: Installs packages directly from `registry.npmjs.org` using pure-JS decompression (`fflate`).
- 🛠️ **On-Demand Dynamic Native Toolchain**: Lazily loads Python and Clang/Musl WASM compilers only when packages require `node-gyp` builds, keeping initial bundle size minimal.
- 🔒 **Cross-Origin Opener / Embedder Isolated**: High-performance I/O streaming using `SharedArrayBuffer` lock-free ring buffers and Atomics.

---

## Installation

```bash
npm install @buddhilive/sandbox
# or
pnpm add @buddhilive/sandbox
# or
yarn add @buddhilive/sandbox
```

---

## Quickstart

```typescript
import { Sandbox } from '@buddhilive/sandbox';

// 1. Initialize sandbox instance
const sandbox = await Sandbox.create();

// 2. Write a script to the in-memory VirtualFS
await sandbox.fs.writeFile(
  '/workspace/index.js',
  `console.log("Hello from inside the client-side Node.js Sandbox!");`
);

// 3. Spawn a process and stream stdout
const proc = await sandbox.process.spawn('node', ['/workspace/index.js']);

const reader = proc.stdout.getReader();
const decoder = new TextDecoder();

while (true) {
  const { value, done } = await reader.read();
  if (done) break;
  console.log(decoder.decode(value));
}

const exitCode = await proc.exit;
console.log('Exited with code:', exitCode);

// 4. Clean up
await sandbox.dispose();
```

---

## Web Server Previews

```typescript
// Listen for virtual port events
sandbox.ports.on('listen', ({ port, url }) => {
  console.log(`Port ${port} opened at preview URL: ${url}`);
  previewIframe.src = url;
});

// Run a web server inside the sandbox
await sandbox.fs.writeFile('/workspace/server.js', `
  const http = require('http');
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Live Preview from In-Browser Sandbox!</h1>');
  });
  server.listen(3000);
`);

await sandbox.process.spawn('node', ['/workspace/server.js']);
```

---

## Architecture Overview

```text
┌─────────────────────────────────────────────────────────────┐
│ Browser Main Thread (Host Application)                      │
│ - import { Sandbox } from '@buddhilive/sandbox'             │
│ - sandbox.fs / sandbox.process / sandbox.ports             │
└──────────────┬──────────────────────────────▲───────────────┘
               │ postMessage                  │ SAB Streams
               ▼                              │
┌─────────────────────────────────────────────┴───────────────┐
│ Web Worker (Execution Sandbox)                              │
│ - Rust WebAssembly (buddhilive-sandbox-core)                │
│ - In-Memory VirtualFS (Inode Table)                         │
│ - QuickJS Virtual Process Context                           │
│ - SPSC Lock-Free SharedArrayBuffer Ring Buffer              │
└─────────────────────────────────────────────────────────────┘
```

---

## Opinionated Next.js Stack (`next-stack` Preset)

The SDK provides first-class, out-of-the-box support for a batteries-included, zero-server Next.js stack:

| Layer | Canonical Package | Verified Version |
|---|---|---|
| **Styling** | `tailwindcss`, `@tailwindcss/postcss` | `^4.0.0` |
| **Components** | `shadcn` primitives, `lucide-react` | `^1.16.0` |
| **AI Elements** | `ai-elements` | `^0.1.0` |
| **State** | `zustand` | `^5.0.0` |
| **Database & ORM** | `drizzle-orm`, `@libsql/client` (WASM) | `^0.38.0` / `^0.14.0` |
| **Authentication** | `better-auth` | `^1.1.0` |
| **Generative AI** | `ai` (Vercel AI SDK), `@ai-sdk/openai` | `^6.0.0` / `^1.1.0` |

### Initializing with `stackPreset`

```typescript
import { Sandbox, scaffoldNextStackApp } from '@buddhilive/sandbox';

// 1. Create sandbox with next-stack preset
const sandbox = await Sandbox.create({
  stackPreset: 'next-stack',
  maxMemoryMb: 1024,
});

// 2. Scaffold all 16 canonical config and starter files
await scaffoldNextStackApp(sandbox, {
  appName: 'my-app',
  withAuth: true,
  withAI: true,
});

// Or via the Sandbox instance helper
await sandbox.scaffoldNextStackApp();
```

---

## License

MIT © BuddhiLive

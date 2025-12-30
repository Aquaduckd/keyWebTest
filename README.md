# KeySharp

A vanilla TypeScript project following the Three-Step Scalability Doctrine.

## Project Structure

```
src/
  ├── features/      # Self-contained feature modules
  │                 # Each feature owns its UI, logic, tests, and API
  │                 # Features do not depend on other features
  │
  ├── foundations/   # Shared code extracted when multiple features need it
  │                 # Foundations never know about features
  │                 # Start minimal and grow only from real usage
  │
  └── main.ts        # Application entry point (coordinates features)
```

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the application (bundles with esbuild):
   ```bash
   npm run build
   ```
   This creates `dist/bundle.js` with all modules bundled together.

3. Watch for changes (rebuilds automatically):
   ```bash
   npm run dev
   ```

4. Type check (optional, separate from build):
   ```bash
   npm run typecheck
   ```

5. Serve the application (in another terminal):
   ```bash
   npm run serve
   ```
   Then open http://localhost:8000 in your browser

**Note**: This project uses esbuild for bundling, which handles module resolution and creates a single bundle file. TypeScript is still used for type checking.

## Style Guide

See [StyleGuide.md](./StyleGuide.md) for the Three-Step Scalability Doctrine:
1. **Isolate by Feature** - Features are self-contained modules
2. **Extract Foundations Early** - Extract shared code when multiple features need it
3. **Expose Only Small Public Interfaces** - Keep public APIs narrow and explicit


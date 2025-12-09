# @clarity-chat/typescript-config

Shared TypeScript configurations for the Clarity Chat monorepo.

## Available Configurations

| Config               | Use Case                                       |
| -------------------- | ---------------------------------------------- |
| `base.json`          | Core settings (strict mode, module resolution) |
| `react-library.json` | React component libraries (extends base)       |
| `node-library.json`  | Node.js libraries without DOM (extends base)   |
| `nextjs.json`        | Next.js applications (extends base)            |

## Usage

In your package's `tsconfig.json`:

```json
{
  "extends": "../typescript-config/react-library.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## Important Notes

1. **Always specify `outDir` and `rootDir`** in your package - these are intentionally not in the
   shared configs because paths are resolved relative to the extending file.

2. **Use relative paths** to extend (`../typescript-config/...`) not package references.

3. **Override strict settings** if your package has legacy code that doesn't compile under strict
   mode.

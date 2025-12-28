# ESLint & Prettier Setup for Next.js with Tailwind CSS

A guide for configuring ESLint and Prettier with Tailwind CSS class ordering and import sorting.

## Prerequisites

- Next.js project with Tailwind CSS
- Package manager (bun, npm, yarn, or pnpm)

## Installation

```bash
# Using bun
bun add -d prettier prettier-plugin-tailwindcss @ianvs/prettier-plugin-sort-imports eslint-plugin-tailwindcss eslint-config-prettier eslint-config-standard

# Using npm
npm install -D prettier prettier-plugin-tailwindcss @ianvs/prettier-plugin-sort-imports eslint-plugin-tailwindcss eslint-config-prettier eslint-config-standard
```

## Configuration Files

### 1. ESLint Configuration (`eslint.config.mjs`)

```javascript
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    'next/core-web-vitals',
    'next/typescript',
    'standard',
    'prettier',
    'plugin:@typescript-eslint/recommended'
  ),
  ...compat.config({
    plugins: ['tailwindcss'],
    rules: {
      'tailwindcss/classnames-order': 'warn',
      'tailwindcss/no-custom-classname': 'off', // Disable if using shadcn/ui
      'tailwindcss/no-contradicting-classname': 'error',
    },
  }),
];

export default eslintConfig;
```

### 2. Prettier Configuration (`prettier.config.js`)

```javascript
/** @type {import('prettier').Config} */
module.exports = {
  trailingComma: 'es5',
  semi: true,
  tabWidth: 2,
  singleQuote: true,
  jsxSingleQuote: true,

  // Import ordering
  importOrder: [
    // React and core libraries
    '^(react/(.*)$)|^(react$)',
    '^(next/(.*)$)|^(next$)',
    '',
    // Third-party modules
    '<THIRD_PARTY_MODULES>',
    '',
    // Internal aliases
    '^types$',
    '^@/lib/(.*)$',
    '^@/hooks/(.*)$',
    '^@/components/ui/(.*)$',
    '^@/components/(.*)$',
    '',
    // Relative imports
    '^[./]',
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],

  // Plugins (order matters - tailwindcss should be last)
  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],

  // Tailwind CSS settings
  tailwindConfig: './tailwind.config.ts',
  tailwindFunctions: ['clsx', 'cn', 'cva'],
};
```

### 3. Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

## Usage

| Command | Description |
|---------|-------------|
| `bun run lint` | Check for linting issues |
| `bun run lint:fix` | Auto-fix ESLint issues |
| `bun run format` | Format all files and sort imports/classes |
| `bun run format:check` | Check if files need formatting |

## What Each Tool Does

### ESLint (`eslint-plugin-tailwindcss`)
- Warns when Tailwind classes are out of order
- Catches contradicting classes (e.g., `flex block`)
- Optionally warns about non-Tailwind classes

### Prettier (`prettier-plugin-tailwindcss`)
- Automatically sorts Tailwind classes on format
- Follows official Tailwind CSS class order

### Import Sorting (`@ianvs/prettier-plugin-sort-imports`)
- Groups imports by type (react, third-party, internal, relative)
- Adds blank lines between groups
- Sorts alphabetically within groups

## Customizing Import Order

Modify the `importOrder` array in `prettier.config.js`:

```javascript
importOrder: [
  // Add your framework imports first
  '^(react/(.*)$)|^(react$)',
  '^(next/(.*)$)|^(next$)',
  
  // Add other frameworks you use
  '^(@tanstack/(.*)$)|^(@tanstack$)',
  
  '',  // Empty string = blank line separator
  
  '<THIRD_PARTY_MODULES>',
  
  '',
  
  // Your internal aliases (match your tsconfig paths)
  '^@/lib/(.*)$',
  '^@/hooks/(.*)$',
  '^@/components/(.*)$',
  
  '',
  
  // Relative imports last
  '^[./]',
],
```

## Customizing Tailwind Functions

If you use utility functions that accept Tailwind classes, add them to `tailwindFunctions`:

```javascript
tailwindFunctions: ['clsx', 'cn', 'cva', 'twMerge'],
```

## VS Code Integration

Add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

## Troubleshooting

### Classes not being sorted
- Ensure `prettier-plugin-tailwindcss` is listed last in plugins array
- Verify `tailwindConfig` path is correct

### Import order not working
- Check that `importOrderParserPlugins` includes your file types
- Ensure regex patterns match your import paths

### ESLint conflicts with Prettier
- Make sure `eslint-config-prettier` is extended last in ESLint config
- This disables ESLint rules that conflict with Prettier

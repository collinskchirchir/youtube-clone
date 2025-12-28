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
      'tailwindcss/no-custom-classname': 'off', // Disabled for shadcn/ui custom classes
      'tailwindcss/no-contradicting-classname': 'error',
    },
  }),
];

export default eslintConfig;

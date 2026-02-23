import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettierPluginRecommended from 'eslint-plugin-prettier/recommended';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettierPluginRecommended,
  globalIgnores([
    'node_modules/**',
    'public/**',
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'src/components/ui/*.*',
    'src/generated/**',
  ]),
  {
    rules: {
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/incompatible-library': 'off',
      'no-console': 'error',
      'prettier/prettier': 'error',
      'max-params': ['error', { max: 3 }],
      'id-length': [
        'error',
        {
          min: 2,
          max: 50,
          exceptions: ['_'],
          properties: 'always',
        },
      ],
    },
  },
]);

export default eslintConfig;

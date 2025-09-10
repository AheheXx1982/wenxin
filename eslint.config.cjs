import eslintPluginAstro from 'eslint-plugin-astro';
import eslintPluginReactGoogleTranslate from 'eslint-plugin-react-google-translate';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// 获取 __dirname 的等效值
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
  // add more generic rule sets here, such as:
  // js.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  ...eslintPluginAstro.configs['jsx-a11y-recommended'],
  {
    plugins: {
      'react-google-translate': eslintPluginReactGoogleTranslate,
    },
    rules: {},
  },
  {
    // 添加对 TypeScript 文件的支持
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
    rules: {}
  },
  {
    // 添加对 Markdown、JSON 文件的配置
    files: ['**/*.md', '**/*.mdx', '**/*.json'],
    rules: {
      // 这些文件类型不需要 ESLint 检查
    }
  }
];
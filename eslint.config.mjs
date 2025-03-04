import tseslint from 'typescript-eslint';
import personal from '@tiagojacinto/eslint-config';
import path from 'path';

export default tseslint.config(
  { ignores: ['dist'] },
  personal.configs.recommended({
    extensions: {
      withProjectService: true,
    },
    plugins: {
      languages: {
        typescript: {
          files: ['**/*.{ts,tsx}'],
        },
        react: true,
      },
    },
  }),
  {
    files: [path.join('./src', './**/*.view.tsx').replaceAll('\\', '/')],
    extends: [personal.architecture.configs.view.jsx],
  },
  personal.configs.browser,
);

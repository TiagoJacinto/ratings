import tseslint from 'typescript-eslint';
import personal from '@tiagojacinto/eslint-config';

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
      formatting: {
        perfectionist: true,
      },
    },
  }),
  {
    files: ['src/**/*.view.tsx'],
    extends: [personal.architecture.configs.view.jsx.recommended],
  },
  personal.configs.browser,
);

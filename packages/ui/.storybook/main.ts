import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@chromatic-com/storybook",

  ],
  framework: "@storybook/react-vite",
  viteFinal: async (config) => {
    const { mergeConfig } = await import("vite");
    const { createRequire } = await import("module");
    const require = createRequire(import.meta.url);
    const path = (await import('path')).default;
    const reactDir = path.dirname(require.resolve('react/package.json'));
    const reactDomDir = path.dirname(require.resolve('react-dom/package.json'));

    return mergeConfig(config, {
      resolve: {
        alias: [
          { find: 'react', replacement: reactDir },
          { find: 'react-dom', replacement: reactDomDir },
        ],
      },
      css: {
        postcss: {
          plugins: [(await import("@tailwindcss/postcss")).default],
        },
      },
    });
  },
};

export default config;

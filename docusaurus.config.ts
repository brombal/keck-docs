import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";

prismThemes.jettwaveDark.plain.backgroundColor = "#182B39";

const config: Config = {
  title: "Keck",
  tagline: "Simple observable state ✨🔭 for React and vanilla JS",
  favicon: "img/keck-favicon-32.png",

  url: "https://brombal.github.io/keck-docs",
  baseUrl: "/",
  trailingSlash: false,

  // GitHub pages deployment config.
  organizationName: "brombal",
  projectName: "keck-docs",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl: "https://github.com/brombal/keck-docs/tree/main/",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "img/docusaurus-social-card.jpg",
    navbar: {
      title: "Keck",
      logo: {
        alt: "Keck Logo",
        src: "img/keck-favicon.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Tutorial",
        },
        {
          href: "https://npmjs.com/package/keck",
          label: "npm",
          position: "right",
        },
        {
          href: "https://github.com/brombal/keck",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      copyright: `Copyright © ${new Date().getFullYear()} Brombal, LLC. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.jettwaveLight,
      darkTheme: prismThemes.jettwaveDark,
      defaultLanguage: "tsx",
      magicComments: [
        {
          className: "theme-code-block-highlighted-line",
          line: "highlight-next-line",
          block: { start: "highlight-start", end: "highlight-end" },
        },
        {
          className: "code-block-error-line",
          line: "This will error",
        },
      ],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

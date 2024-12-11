import { themes as prismThemes } from 'prism-react-renderer';

import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
    title: 'Jelly SQL',
    tagline: 'The jelly goes jiggle-jiggle',
    favicon: 'img/favicon.svg',
    url: 'https://docs.jellysql.com/',
    baseUrl: '/',
    organizationName: 'andreschoultz',
    projectName: 'jelly-sql',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },
    headTags: [
        {
            tagName: 'meta',
            attributes: {
                name: 'description',
                content: 'Jelly SQL is a powerful JavaScript library designed to query the DOM using SQL syntax',
            },
        },
        {
            tagName: 'meta',
            attributes: {
                name: 'keywords',
                content: 'Jelly SQL, JavaScript SQL, DOM querying, SQL parser, JavaScript library, documentation',
            },
        },
        {
            tagName: 'meta',
            attributes: {
                name: 'robots',
                content: 'index, follow',
            },
        },
    ],
    presets: [
        [
            'classic',
            {
                docs: {
                    sidebarPath: './sidebars.ts',
                    editUrl: 'https://github.com/andreschoultz/jelly-sql',
                },
                blog: {
                    showReadingTime: true,
                    feedOptions: {
                        type: ['rss', 'atom'],
                        xslt: true,
                    },
                    editUrl: 'https://github.com/andreschoultz/jelly-sql',
                    onInlineTags: 'warn',
                    onInlineAuthors: 'warn',
                    onUntruncatedBlogPosts: 'warn',
                },
                theme: {
                    customCss: './src/css/custom.css',
                },
            } satisfies Preset.Options,
        ],
    ],

    themeConfig: {
        image: 'img/logo.svg',
        navbar: {
            title: 'Jelly SQL',
            logo: {
                alt: 'Jelly SQL Site Logo',
                src: 'img/logo.svg',
            },
            items: [
                {
                    type: 'docSidebar',
                    sidebarId: 'tutorialSidebar',
                    position: 'left',
                    label: 'Docs',
                },
                {
                    type: 'docSidebar',
                    sidebarId: 'tutorialSidebar',
                    position: 'left',
                    label: 'Quick Start',
                },
                {
                    href: 'https://github.com/andreschoultz/jelly-sql',
                    label: 'GitHub',
                    position: 'right',
                },
            ],
        },
        footer: {
            style: 'dark',
            links: [
                {
                    title: 'Docs',
                    items: [
                        {
                            label: 'Quick Start',
                            to: '/docs/quick-start',
                        },
                        {
                            label: 'API',
                            to: '/docs/api',
                        },
                        {
                            label: 'CSS Selectors',
                            to: '/docs/category/css-selectors',
                        },
                        {
                            label: 'Language & Syntax',
                            to: '/docs/category/language--syntax-structure',
                        },
                        {
                            label: 'Limitations',
                            to: '/docs/limitations',
                        },
                    ],
                },
                {
                    title: 'Community',
                    items: [
                        {
                            label: 'Github',
                            href: 'https://github.com/andreschoultz/jelly-sql/issues',
                        },
                    ],
                },
                {
                    title: 'More',
                    items: [
                        {
                            label: 'GitHub',
                            href: 'https://github.com/andreschoultz/jelly-sql',
                        },
                        {
                            label: 'NPM',
                            href: 'https://www.npmjs.com/package/jelly-sql',
                        },
                    ],
                },
            ],
            copyright: `Copyright © ${new Date().getFullYear()} Andre Schoultz`,
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
            magicComments: [
                {
                    className: 'theme-code-block-highlighted-line',
                    line: 'highlight-next-line',
                    block: { start: 'highlight-start', end: 'highlight-end' },
                },
                {
                    className: 'code-block-error-line',
                    line: 'highlight-next-line-error',
                    block: { start: 'highlight-start-error', end: 'highlight-end-error' },
                },
            ],
        },
        algolia: {
            appId: '9UKK91VTS8',
            apiKey: '343c61b3d2e4e5d6c068bfacbd07ea05',
            indexName: 'jellysql',
            contextualSearch: true,
            externalUrlRegex: 'external\\.com|domain\\.com',
            searchParameters: {},
            searchPagePath: 'search',
            insights: false,
        },
    } satisfies Preset.ThemeConfig,
};

export default config;

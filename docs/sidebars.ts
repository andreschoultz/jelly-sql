import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const sidebars: SidebarsConfig = {
    tutorialSidebar: [{ type: 'autogenerated', dirName: '.' }],
};

export default sidebars;

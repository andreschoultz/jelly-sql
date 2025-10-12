import React from 'react';

import Playground from '@site/src/components/Playground/Playground';
import Layout from '@theme/Layout';

export default function PlaygroundPage(): JSX.Element {
  return (
    <Layout
      title="Interactive Playground"
      description="Try jelly-sql queries in an interactive playground"
    >
      <main>
        <Playground />
      </main>
    </Layout>
  );
}
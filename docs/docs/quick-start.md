---
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Quick Start

Jelly SQL is a SQL-like language for querying the DOM. It allows you to generate CSS selectors using SQL syntax. See the [quick start example](./api.md#example) for more information.

## Getting Started

Jelly SQL requires no third-party dependencies. You can use it in the browser or in Node.js. TypeScript is also supported.

### Using `npm` or `yarn`

#### Install

<Tabs groupId="npm-yarn">
<TabItem value="npm" label="NPM">

```shell
npm install jelly-sql
```

</TabItem>
<TabItem value="yarn" label="Yarn">

```shell
yarn add jelly-sql
```

</TabItem>
</Tabs>

#### Import & Use

See the [API documentation](./api.md) for more information, and the [cheat sheet](./selectors/refernece-table.md) for a quick reference.

```typescript
import { query } from 'jelly-sql';

const selector = query(`SELECT * FROM DOM WHERE TAG = 'a'`);
console.log(selector); // Output: "a"
```

### Using a CDN (Browser)

You can also use Jelly SQL in the browser by including the following script tag:

```html
<script src="https://cdn.jsdelivr.net/npm/jelly-sql@latest/build/dist/jelly-sql.min.js"></script>
```

#### Usage

This will expose the `jellySQL` object globally, which you can use to query the DOM. See the [API documentation](./api.md) for more information, and the [cheat sheet](./selectors/refernece-table.md) for a quick reference.

```html

```javascript
const selector = jellySQL.query(`SELECT * FROM DOM WHERE TAG = 'a'`);
console.log(selector); // Output: "a"
```
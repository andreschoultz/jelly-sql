---
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import TOCInline from '@theme/TOCInline';

# API

## Introduction

Jelly SQL has a very basic API that serves a single purpose: to query the DOM using SQL-like syntax. The API is designed to be simple and easy to use, with a focus on the core functionality of querying the DOM.

<TOCInline toc={toc} />

## API Reference

The Jelly SQL API consists of a single entry function (a iife): `jellySQL`, with the following accessible properties:

### The `query()` Function

The `query` function takes in a single argument, a string, which is the Jelly SQL query to be executed. The function returns a CSS selector string that can be used to target the elements in the DOM that match the query.

| Name    | Type     | Arguments      | Returns |
| ------- | -------- | -------------- | ------- |
| `query` | Function | `sql` (String) | String  |

#### Example

<Tabs groupId="javascript-css-output">
<TabItem value="js" label="Javascript">

```javascript
const selector = jellySQL.query(`SELECT * FROM DOM WHERE TAG = 'a'`);
console.log(selector); // Output: "a"

const jsElements = document.querySelectorAll(selector); // Select all <a> elements in the DOM
const jQElements = $(selector); // Target/select all <a> elements in the DOM using jQuery
```

</TabItem>
<TabItem value="sql" label="SQL">

```sql
SELECT * FROM DOM WHERE
TAG = 'a'
```

</TabItem>
<TabItem value="css" label="CSS">

```css
a {
  /* Styles */
}
```

</TabItem>
</Tabs>


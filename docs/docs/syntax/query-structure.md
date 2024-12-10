import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import TOCInline from '@theme/TOCInline';

# Query Structure

Jelly SQL CSS is a powerful tool that allows you to query the DOM using SQL-like syntax. This page will guide you through the basic structure of a Jelly SQL CSS query.

## Basic Structure

A Jelly SQL CSS query consists of the following components:

- [Select statement](#select-statement)
- [Conditions](./operators.md#logical)
- [Keywords](./keywords.md)
- [Functions](./functions.md)
- [Comments](./comments.md)



## Select Statement

The `SELECT * FROM DOM` statement in Jelly SQL serves as the opening statement for a Jelly SQL CSS query. However, at this stage, it is not necessary to include the `SELECT * FROM DOM` statement in your query, and does not affect the output of the query.

#### Take this simple query as a example:

<Tabs groupId="sql-css">
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

The query above can be simplified to a condition:

<Tabs groupId="sql-css">
<TabItem value="sql" label="SQL">

```sql
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

:::note

The `SELECT * FROM DOM` statement is optional and can be omitted from the query. However, it is recommended to include it for clarity and consistency. In future versions, if the select statement ends up serving a purpose, it will allow backward compatibility with older queries where it was omitted.

:::
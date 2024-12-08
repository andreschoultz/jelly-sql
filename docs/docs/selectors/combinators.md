import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import TOCInline from '@theme/TOCInline';

# Combinators

Combinators are used to define the relationship between elements in a query. They are used to specify how elements should be selected based on their position in the DOM. Combinators are not case sensitive.

<TOCInline toc={toc} />

### A few things to keep in mind

- In CSS, combinator selectors are evaluated from right to left. In Jelly SQL, the order is defined by the language itself.
- When chaining multiple combinators, the use of the `AND` operator is not required. The parser will automatically group and treat them as `AND` operators.
- The parser will not protect you from writing invalid CSS selectors. It is up to you to ensure that the query is valid and complies with the [W3C standards](https://www.w3.org/TR/selectors-3/#combinators).

## Quick Reference

| Type               | SQL Keywords | CSS Separator           |
| ------------------ | ------------ | ----------------------- |
| Descendant         | `WITHIN`     | ` ` (whitespace)        |
| Child              | `CHILD OF`   | `>` (greater-than sign) |
| Next-Sibling       | `NEXT TO`    | `+` (plus sign)         |
| Subsequent-Sibling | `SIBLING OF` | `~` (tiled sign)        |

## Descendant Combinator

The descendant combinator (` ` - whitespace) is used to select elements that are descendants of another element. It returns elements that are descendants of the specified element.

#### Here's an example to illustrate:

<Tabs groupId="sql-css">
<TabItem value="sql" label="SQL">

```sql
SELECT * FROM DOM WHERE
TAG('p') WITHIN TAG('div')
```

</TabItem>
<TabItem value="css" label="CSS">

```css
div p {
  /* Styles */
}
```

</TabItem>
</Tabs>

In this example:

- The SQL query selects `<p>` elements that are descendants of `<div>` elements.
- The CSS selector applies styles to `<p>` elements that are descendants of `<div>` elements.

## Child Combinator

The child combinator (`>`) is used to select elements that are direct children of another element. It returns elements that are direct children of the specified element.

#### Here's an example to illustrate:

<Tabs groupId="sql-css">
<TabItem value="sql" label="SQL">

```sql
SELECT * FROM DOM WHERE
TAG('p') CHILD OF TAG('div')
```

</TabItem>
<TabItem value="css" label="CSS">

```css
div > p {
  /* Styles */
}
```

</TabItem>
</Tabs>

In this example:

- The SQL query selects `<p>` elements that are direct children of `<div>` elements.
- The CSS selector applies styles to `<p>` elements that are direct children of `<div>` elements.

## Next-Sibling Combinator

The next-sibling combinator (`+`) is used to select elements that are immediately preceded by another element. It returns elements that are siblings and immediately follow the specified element.

#### Here's an example to illustrate:

<Tabs groupId="sql-css">
<TabItem value="sql" label="SQL">

```sql
SELECT * FROM DOM WHERE
TAG('p') NEXT TO TAG('div')
```

</TabItem>
<TabItem value="css" label="CSS">

```css
div + p {
  /* Styles */
}
```

</TabItem>
</Tabs>

In this example:

- The SQL query selects `<p>` elements that are immediately preceded by `<div>` elements.
- The CSS selector applies styles to `<p>` elements that are immediately preceded by `<div>` elements.

## Subsequent-Sibling Combinator

The subsequent-sibling combinator (`~`) is used to select elements that are siblings of another element. It returns elements that are siblings of the specified element.

#### Here's an example to illustrate:

<Tabs groupId="sql-css">
<TabItem value="sql" label="SQL">

```sql
SELECT * FROM DOM WHERE
TAG('p') SIBLING OF TAG('div')
```

</TabItem>
<TabItem value="css" label="CSS">

```css
div ~ p {
  /* Styles */
}
```

</TabItem>
</Tabs>

In this example:

- The SQL query selects `<p>` elements that are siblings of `<div>` elements.
- The CSS selector applies styles to `<p>` elements that are siblings of `<div>` elements.

## Mix of Everything

#### Here's an example to illustrate:

<Tabs groupId="sql-css">
<TabItem value="sql" label="SQL">

```sql
SELECT * FROM DOM WHERE
TAG('ul') SIBLING OF TAG('p')
AND CHILD OF TAG('div')
OR TAG('li') WITHIN TAG('ul')
```

</TabItem>
<TabItem value="css" label="CSS">

```css
div > p ~ ul, ul li {
  /* Styles */
}
```

</TabItem>
</Tabs>

In this example:

- The SQL query selects `<ul>` elements that are siblings of `<p>` elements and are direct children of `<div>` elements, or `<li>` elements that are descendants of `<ul>` elements.
- The CSS selector applies styles to `<ul>` elements that are siblings of `<p>` elements and are direct children of `<div>` elements, or `<li>` elements that are descendants of `<ul>` elements.

## Limitations

Due to the limitations mentioned in the [grouping expressions](../syntax/logical-grouping.md#limitations) section, there are cases where completely valid CSS combinator selectors may not be supported by Jelly SQL.

For example, the following CSS selector is valid but not supported by Jelly SQL:

```css
div > span > p[data-color="orange"], div [data-color], div > div p + span.text-blue, div ~ p {
  /* Styles */
}
```

A SQL-like equivalent of the above CSS selector would be:

```sql
SELECT * FROM DOM WHERE
    ((TAG = 'p' AND ATTRIBUTE('data-color') = 'orange') CHILD OF TAG('div') AND CHILD OF TAG('div')) -- Unsupported nested groupings
OR  (Attribute('data-color') WITHIN TAG('div'))
OR  ((TAG = 'span' AND CLASS = 'text-blue') NEXT TO TAG('p') AND WITHIN TAG('div') AND CHILD OF TAG('div')) -- Unsupported nested groupings
OR  (TAG('p') SIBLING OF TAG('div'))
```

In this case, the parser will not be able to parse the query and will return an error. To avoid this, you can break down the query into smaller parts (by `OR` would be ideal) and run them separately.
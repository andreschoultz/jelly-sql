import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import TOCInline from '@theme/TOCInline';

# Operators

Operators are used to perform operations on values in a query. They are used to specify conditions that elements must meet to be selected. When applied to CSS selectors, operators can be used to target elements based on their attributes or properties. Operators are not case sensitive.

<TOCInline toc={toc} />

## Logical

Logical operators perform logical comparisons and operations on selectors. They are used to combine multiple selectors to create more complex queries. When applied to CSS selectors, logical operators can be used to target elements that match multiple conditions.

They come in two forms:
- `AND`
- `OR`

### Logical AND

The `AND` operator is used to combine two or more selectors. It returns elements that match all of the selectors. When applied to CSS selectors, it can be used to style elements that match all of the given selectors.

#### Here's an example to illustrate:

<Tabs groupId="sql-css">
<TabItem value="sql" label="SQL">

```sql
SELECT * FROM DOM WHERE
TAG = 'p' AND CLASS = 'body'
```

</TabItem>
<TabItem value="css" label="CSS">

```css
p.body {
  /* Styles */
}
```

</TabItem>
</Tabs>

In this example:

- The SQL query selects elements that are both `<p>` and have the class `body`.
- The CSS selector applies styles to `<p>` elements with the class `body`.

### Logical OR

The OR operator is used to combine multiple conditions in a query, returning results that match any of the specified conditions. When applied to CSS selectors, it can be used to style elements that match any of the given selectors.

#### Here's an example to illustrate:

<Tabs groupId="sql-css">
<TabItem value="sql" label="SQL">

```sql
SELECT * FROM DOM WHERE
TAG = 'p' OR TAG = 'div'
```

</TabItem>
<TabItem value="css" label="CSS">

```css
p, div {
  /* Styles */
}
```

</TabItem>
</Tabs>

In this example:

- The SQL query selects elements that are either `<p>` or `<div>`.
- The CSS selector applies styles to both `<p>` and `<div>` elements.

### Basic Combining of OR & AND

You can combine multiple selectors using logical operators to create more complex queries.

#### Here's an example to illustrate:

<Tabs groupId="sql-css">
<TabItem value="sql" label="SQL">

```sql
SELECT * FROM DOM WHERE
TAG = 'p' AND CLASS = 'body' OR TAG = 'div'
```

</TabItem>
<TabItem value="css" label="CSS">

```css
p.body, div {
  /* Styles */
}
```

</TabItem>
</Tabs>

In this example:

- The SQL query selects elements that are either `<p>` with the class `body`, or `<div>`.
- The CSS selector applies styles to `<p>` elements with the class `body`, and `<div>` elements.

## Comparison

Comparison operators are used to compare values in a query. They are used to specify conditions that elements must meet to be selected. When applied to CSS selectors, comparison operators can be used to target elements based on their attributes or properties.

They come in the following forms:
- `=`, `==` or `EQUALS` (Equal)
- `!=`, `<>` or `NOT EQUALS` (Not Equal)
- `NOT LIKE` (Not Like)

### Equal

The `=` operator is used to compare two values for equality. It returns elements that have the same value as the specified condition. When applied to CSS selectors, it can be used to style elements that have the same value as the specified condition.

#### Variants that can be used interchangeably:

- `=`
- `==`
- `EQUALS`

#### Here's an example to illustrate:

<Tabs groupId="sql-css">
<TabItem value="sql" label="SQL">

```sql
SELECT * FROM DOM WHERE
TAG = 'p'
```

</TabItem>
<TabItem value="css" label="CSS">

```css
p {
  /* Styles */
}
```

</TabItem>
</Tabs>

In this example:

- The SQL query selects all `<p>` elements.
- The CSS selector applies styles to all `<p>` elements.

### Not Equal

The `<>` operator is used to compare two values for inequality. It returns elements that do not have the same value as the specified condition. When applied to CSS selectors, it can be used to style elements that do not have the same value as the specified condition.

#### Variants that can be used interchangeably:

- `!=`
- `<>`
- `NOT EQUALS`

#### Here's an example to illustrate:

<Tabs groupId="sql-css">
<TabItem value="sql" label="SQL">

```sql
SELECT * FROM DOM WHERE
TAG <> 'p'
```

</TabItem>
<TabItem value="css" label="CSS">

```css
:not(p) {
  /* Styles */
}
```

</TabItem>
</Tabs>

In this example:

- The SQL query selects all elements that are not `<p>`.
- The CSS selector applies styles to all elements that are not `<p>`.

### Not Like

The `NOT LIKE` operator is used to negate a pattern match in a query. When applied to CSS selectors, it can be used to target attributes that do not contain a specific pattern.

#### Here's an example to illustrate:

<Tabs groupId="sql-css">
<TabItem value="sql" label="SQL">

```sql
SELECT * FROM DOM WHERE
ATTR('data-source') NOT LIKE '%jellysql.com%'
```

</TabItem>
<TabItem value="css" label="CSS">

```css
:not([data-source*="jellysql.com"]) {
  /* Styles */
}
```

</TabItem>
</Tabs>

In this example:

- The SQL query selects elements with an attribute `data-source` that does not contain the string `jellysql.com`.
- The CSS selector applies styles to elements with an attribute `data-source` that does not contain the string `jellysql.com`.

****You can read more about the `LIKE` operator in the [Pattern Matching](#like) section.***

## Pattern Matching

Pattern matching operators are used to match patterns in a query. They are used to specify conditions that elements must meet to be selected. When applied to CSS selectors, pattern matching operators can be used to target elements based on their attributes or properties.

They come in the following forms:
- `LIKE`
- `CONTAINS`

### Like

The `LIKE` operator is used to match patterns in a query. When applied to CSS selectors, it can be used to target attributes that contain a specific pattern.

#### Pattern Matching:

Wildcard characters can be only be placed at the beginning or end of the pattern. You can use double `%` to escape the `%` character and invalidate the wildcard.

- `LIKE '%pattern%'` - Matches any string that contains the pattern. *Note, using `LIKE` without `%` is equivalent to `%pattern%`.*
  - CSS equivalent: `[data*="pattern"]`
- `LIKE 'pattern%'` - Matches any string that starts with the pattern.
  - CSS equivalent: `[data^="pattern"]`
- `LIKE '%pattern'` - Matches any string that ends with the pattern.
  - CSS equivalent: `[data$="pattern"]`

#### Here's an example to illustrate:

<Tabs groupId="sql-css">
<TabItem value="sql" label="SQL">

```sql
SELECT * FROM DOM WHERE
ATTR('data-source') LIKE '%jellysql.com%'
```

</TabItem>
<TabItem value="css" label="CSS">

```css
[data-source*="jellysql.com"] {
  /* Styles */
}
```

</TabItem>
</Tabs>

In this example:

- The SQL query selects elements with an attribute `data-source` that contains the string `jellysql.com`.
- The CSS selector applies styles to elements with an attribute `data-source` that contains the string `jellysql.com`.

### Contains

The `CONTAINS` operator is used to match patterns in a query. When applied to CSS selectors, it can be used to target attributes that contain a specific pattern.

#### Here's an example to illustrate:

<Tabs groupId="sql-css">
<TabItem value="sql" label="SQL">

```sql
SELECT * FROM DOM WHERE
ATTR('data-source') CONTAINS 'jellysql.com'
```

</TabItem>
<TabItem value="css" label="CSS">

```css
[data-source~="jellysql.com"] {
  /* Styles */
}
```

</TabItem>
</Tabs>

In this example:

- The SQL query selects elements with an attribute `data-source` whose value is a list of whitespace-separated values, one of which is exactly equal to `jellysql.com`.
- The CSS selector applies styles to elements with an attribute `data-source` whose value is a list of whitespace-separated values, one of which is exactly equal to `jellysql.com`.

## Combinators

Combinators are used to combine multiple selectors to create more complex queries. They are used to specify the relationship between elements in the query. When applied to CSS selectors, combinators can be used to target elements based on their position in the DOM.

The reserved keywords for combinators are:
- `CHILD`
- `SIBLING`
- `NEXT`
- `WITHIN`
- `OF`
- `TO`

We won't going into detail about these combinators here, but you can find more information in the [Combinators](./combinators.md) section.
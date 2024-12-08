---
sidebar_label: Grouping Expressions
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import TOCInline from '@theme/TOCInline';

# Logical Grouping & Precedence

Logical grouping is a way to group multiple conditions together to form a single condition. This is useful when you want to apply the same logical operator to multiple conditions. For example, you can group two conditions together and apply the `AND` operator to them.

<TOCInline toc={toc} />

## Self Grouping

Self grouping expressions is the process of automatically grouping expressions based on their logical operator, or keyword.

The parser will always group `AND` expressions together. Thus `OR` operators will determine the split between groups. As described in the ##TODO: Combinators## section, the parser will also group and treat them as `AND` operators. Hence why the `AND` operator is not required when chaining combinators.

#### Here's an example to illustrate self grouping:

<Tabs groupId="sql-css">
<TabItem value="sql" label="SQL">

```sql
SELECT * FROM DOM WHERE
TAG = 'a' AND CLASS = 'active'
OR CLASS = 'link'
OR TAG = 'button' AND ID = 'to-top-link'
```

</TabItem>
<TabItem value="css" label="CSS">

```css
a.active, .link, button#to-top-link {
  /* Styles */
}
```

</TabItem>
</Tabs>

In this example:

- The SQL query selects elements that are:
  - `<a>` elements with the class `active`.
  - Elements with the class `link`.
  - `<button>` elements with the ID `to-top-link`.
- The parser groups the conditions based on the `OR` operator. Similarly, the above query can also be written as:

```sql
SELECT * FROM DOM WHERE
(TAG = 'a' AND CLASS = 'active')
OR CLASS = 'link'
OR (TAG = 'button' AND ID = 'to-top-link')
```

:::info

For readability sake, manually define groupings - with parentheses `()` - where possible.

:::


## Manual Grouping with Parentheses

Manual grouping is the process of explicitly grouping expressions together using parentheses `()`. This is useful when you want to apply a specific logical operator to multiple conditions.

#### Here's an example to illustrate manual grouping:

<Tabs groupId="sql-css">
<TabItem value="sql" label="SQL">

```sql
SELECT * FROM DOM WHERE
(TAG = 'a' AND CLASS = 'active')
OR (CLASS = 'link' AND TAG = 'button')
```

</TabItem>
<TabItem value="css" label="CSS">

```css
a.active, button.link {
  /* Styles */
}
```

</TabItem>
</Tabs>

In this example:

- The SQL query selects elements that are:
  - `<a>` elements with the class `active`.
  - `<button>` elements with the class `link`.

### Parser Intervention

CSS Selectors are quite basic in nature, and thus attempting 'unique' `AND`/`OR` combinations purely based on logical principles driven by the user, may not always work as expected. The parser will intervene and group expressions based on the logical operator precedence. In a way, the parser will always try to ensure that the query is valid and can be parsed correctly in accordance with W3C standards.

#### Extending from the above example, here's an example to illustrate parser intervention:

<Tabs groupId="sql-css">
<TabItem value="sql" label="SQL">

```sql
SELECT * FROM DOM WHERE
(
    TAG = 'a' AND CLASS = 'active' -- Removed manual parentheses that closed off the 'AND' grouping
    OR CLASS = 'link' AND TAG = 'button'
)
```

</TabItem>
<TabItem value="css" label="CSS">

```css
a.active, button.link { /* Result remains the same */
  /* Styles */
}
```

</TabItem>
</Tabs>


## Cross-Apply

Cross-apply is a way to apply a single selector to multiple conditions. This is useful to shorthand most queries and reduce redundancy.

Cross-apply expressions can be achieved by grouping multiple `OR` expressions, and preceding them with a single `AND` selector. This will apply the `AND` selector to each `OR` expression.

#### Here's an example to illustrate cross-apply:

<Tabs groupId="sql-css">
<TabItem value="sql" label="SQL">

```sql
SELECT * FROM DOM WHERE
TAG = 'a' AND (CLASS = 'active' OR CLASS = 'link')
```

</TabItem>
<TabItem value="css" label="CSS">

```css
a.active, a.link {
  /* Styles */
}
```

</TabItem>

<TabItem value="sql_alt" label="SQL Alternative">

```sql
SELECT * FROM DOM WHERE
TAG = 'a' AND CLASS = 'active'
OR TAG = 'a' AND CLASS = 'link'
```

</TabItem>
</Tabs>

In this example:

- The SQL query selects `<a>` elements that have either the class `active` or `link`.
- The CSS selector applies styles to `<a>` elements with the class `active` or `link`.

### Advanced Cross-Apply Grouping

Cross-apply can also be used to apply multiple selectors to multiple conditions. This is useful when you have multiple conditions that overlap with each other.

#### Here's an example to illustrate advanced cross-apply grouping:

<Tabs groupId="sql-css">
<TabItem value="sql" label="SQL">

```sql
SELECT * FROM DOM WHERE
CLASS = 'orange' AND TAG = 'a' 
AND (
        CLASS = 'active' AND ID = 'new-link'
        OR CLASS = 'link' AND ID = 'old-link'
    )
```

</TabItem>
<TabItem value="css" label="CSS">

```css
a#new-link.orange.active, a#old-link.orange.link {
  /* Styles */
}
```

</TabItem>

<TabItem value="sql_alt" label="SQL Alternative">

```sql
SELECT * FROM DOM WHERE
CLASS = 'orange' AND TAG = 'a' AND CLASS = 'active' AND ID = 'new-link'
OR CLASS = 'orange' AND TAG = 'a' AND CLASS = 'link' AND ID = 'old-link'
```

</TabItem>
</Tabs>

In this example:

- The SQL query selects `<a>` elements that are:
  - Orange and have the class `active` and ID `new-link`.
  - Orange and have the class `link` and ID `old-link`.

:::warning

As of `V1.0`, cross-apply selectors must always precede the `OR` expressions. Appending them after an `OR` expression will result in unexpected behavior.


<Tabs groupId="sql-css">
<TabItem value="sql-invalid" label="SQL Invalid">

```sql
SELECT * FROM DOM WHERE
(CLASS = 'active' OR CLASS = 'link') AND TAG = 'a' -- Cross-apply selector is placed after the OR expression
```

</TabItem>
<TabItem value="sql-valid" label="SQL Valid">

```sql
SELECT * FROM DOM WHERE
TAG = 'a' AND (CLASS = 'active' OR CLASS = 'link') -- Cross-apply selector is placed before the OR expression
```

</TabItem>
</Tabs>

:::

## Limitations

The parser currently only supports shallow grouping. Meaning, you can not nest multiple groups within each other.

For example, the following query is invalid and will likely throw a parsing error, or generate invalid CSS selectors:

```sql
SELECT * FROM DOM WHERE
TAG = 'a' AND (CLASS = 'active' OR (CLASS = 'link' AND ID = 'new-link'))
```
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import TOCInline from '@theme/TOCInline';

# Keywords

Keywords are reserved words in the syntax that have special meaning. Keywords are used to define the structure of the query and to specify the elements that should be selected. Keywords are not case sensitive.

Keywords may be used in string literals, but they are not treated as keywords in that context. For example, `LINK` is a keyword, but `'LINK'` is a string literal that may be used in attribute selectors.

<TOCInline toc={toc} />

## Priority

CSS Selectors are written in a specific order. For example, element selectors are written before attribute or pseudo selectors. Aside from combinators, you don't have to worry about maintaining this order in your Jelly SQL. The parser will automatically sort the selectors in the correct order.

#### Parser Order (Highest to Lowest) 

1. `TAG` || `ELEMENT`
2. `ID`
3. `CLASS`
4. `ATTRIBUTE` || `ATTR`

:::note

Any not mentioned, will be sorted based on the defined order in your Jelly SQL query.

:::

### Combinators

CSS combinator selectors are evaluated from right to left. In Jelly SQL, the order is defined by the language itself.

Here's an example of a combinator in CSS:

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

## Statement Keywords

Statement keywords are used to define the structure of the query. They are used to specify the type of operation that should be performed on the elements.

| Keyword  | Introduced |
| -------- | ---------- |
| `SELECT` | 1.0.0      |
| `FROM`   | 1.0.0      |
| `WHERE`  | 1.0.0      |
| `AS`     | 1.0.0      |

## Element Keywords

Element keywords are used to specify the elements or attribute type that should be targeted by the query. 

| Keyword     | Introduced |
| ----------- | ---------- |
| `TAG`       | 1.0.0      |
| `ELEMENT`   | 1.0.0      |
| `ID`        | 1.0.0      |
| `CLASS`     | 1.0.0      |
| `ATTRIBUTE` | 1.0.0      |
| `ATTR`      | 1.0.0      |
| `STYLE`     | 1.0.0      |

## Pseudo Selector Keywords

Pseudo selector keywords are used to specify the type of element that should be selected based on its position or state.

| Keyword       | Type        | Introduced |
| ------------- | ----------- | ---------- |
| `FIRST`       | Structural  | 1.0.0      |
| `LAST`        | Structural  | 1.0.0      |
| `ODD`         | Structural  | 1.0.0      |
| `EVEN`        | Structural  | 1.0.0      |
| `ONLY`        | Structural  | 1.0.0      |
| `EMPTY`       | Structural  | 1.0.0      |
| `ROOT`        | Structural  | 1.0.0      |
| `LINK`        | Link        | 1.0.0      |
| `VISITED`     | Link        | 1.0.0      |
| `ACTIVE`      | User Action | 1.0.0      |
| `HOVER`       | User Action | 1.0.0      |
| `FOCUS`       | User Action | 1.0.0      |
| `ENABLED`     | UI Element  | 1.0.0      |
| `DISABLED`    | UI Element  | 1.0.0      |
| `CHECKED`     | UI Element  | 1.0.0      |
| `FIRSTLINE`   | Misc        | 1.0.0      |
| `FIRSTLETTER` | Misc        | 1.0.0      |
| `TARGET`      | Misc        | 1.0.0      |
| `BEFORE`      | Misc        | 1.0.0      |
| `AFTER`       | Misc        | 1.0.0      |

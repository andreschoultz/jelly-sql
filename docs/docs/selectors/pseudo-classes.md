import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import TOCInline from '@theme/TOCInline';

# Pseudo Classes

Pseudo classes are used to target elements based on their state or position in the DOM tree. They allow you to select elements based on their relationship with other elements, such as their parent, sibling, or child elements.

All pseudo classes are used with the `TYPEOF` function to target elements based on their type.

<TOCInline toc={toc} />

## Quick Reference

| SQL Keyword   | CSS              | Description                                                                              |
| ------------- | ---------------- | ---------------------------------------------------------------------------------------- |
| `EMPTY`       | `:empty`         | An element that has no children (including text nodes)                                   |
| `LINK`        | `:link`          | An element being the source anchor of a hyperlink of which the target is not yet visited |
| `VISITED`     | `:visited`       | An element being the source anchor of a hyperlink of which the target is already visited |
| `HOVER`       | `:hover`         | An element that is being hovered over by the mouse pointer                               |
| `ACTIVE`      | `:active`        | An element that is being activated by the user                                           |
| `HOVER`       | `:hover`         | An element that is being hovered over by the mouse pointer                               |
| `FOCUS`       | `:focus`         | An element that has received focus                                                       |
| `TARGET`      | `:target`        | An element being the target of the referring URI                                         |
| `ENABLED`     | `:enabled`       | A user interface element that is enabled                                                 |
| `DISABLED`    | `:disabled`      | A user interface element that is disabled                                                |
| `CHECKED`     | `:checked`       | A user interface element that is checked (for instance a radio-button or checkbox)       |
| `FIRSTLINE`   | `::first-line`   | The first formatted line of an element                                                   |
| `FIRSTLETTER` | `::first-letter` | The first formatted letter of an element                                                 |
| `BEFORE`      | `::before`       | The content inserted before an element                                                   |
| `AFTER`       | `::after`        | The content inserted after an element                                                    |

## The `TYPEOF` Function

The `TYPEOF` function is defined as `TYPEOF(<keyword>)`.

#### Here's an example to illustrate:

<Tabs groupId="sql-css">
<TabItem value="sql" label="SQL">

```sql
SELECT * FROM DOM WHERE
TAG('p') AND TYPEOF(ENABLED)
```

</TabItem>
<TabItem value="css" label="CSS">

```css
p:enabled {
  /* Styles */
}
```

</TabItem>
</Tabs>

In this example:

- The SQL query selects `<p>` elements that are enabled.
- The CSS selector applies styles to `<p>` elements that are enabled.
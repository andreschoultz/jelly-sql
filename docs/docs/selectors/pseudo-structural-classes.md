import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import TOCInline from '@theme/TOCInline';

# Pseudo-Structural Classes

Pseudo-structural classes are used to target elements based on their position in the DOM tree. They allow you to select elements based on their relationship with other elements, such as their parent, sibling, or child elements.

<TOCInline toc={toc} />

## Quick Reference

| SQL                           | CSS                    | Description                                              | SQL Alternative                |
| ----------------------------- | ---------------------- | -------------------------------------------------------- | ------------------------------ |
| `CHILD(ROOT)`                 | `:root`                | The root of the document                                 |                                |
| `CHILD(2N+1)`                 | `:nth-child(n)`        | The n-th child of its parent                             | `CHILD(FIRST, 2N+1)`           |
| `CHILD(LAST, 2N+1)`           | `:nth-last-child(n)`   | The n-th child of its parent, counting from the last one |                                |
| `CHILD(2N+1) AS TYPEOF`       | `:nth-of-type(n)`      | The n-th sibling of its type                             | `CHILD(FIRST, 2N+1) AS TYPEOF` |
| `CHILD(LAST, 2N+1) AS TYPEOF` | `:nth-last-of-type(n)` | The n-th sibling of its type, counting from the last one |                                |
| `CHILD()`                     | `:first-child`         | The first child of its parent                            | `CHILD(FIRST)`                 |
| `CHILD(LAST)`                 | `:last-child`          | The last child of its parent                             |                                |
| `CHILD() AS TYPEOF`           | `:first-of-type`       | The first sibling of its type                            | `CHILD(FIRST) AS TYPEOF`       |
| `CHILD(LAST) AS TYPEOF`       | `:last-of-type`        | The last sibling of its type                             |                                |
| `CHILD(ONLY)`                 | `:only-child`          | The only child of its parent                             |                                |
| `CHILD(ONLY) AS TYPEOF`       | `:only-of-type`        | The only sibling of its type                             |                                |
| `CHILD(EMPTY)`                | `:empty`               | An element that has no children (including text nodes)   |                                |

## The `CHILD` Function

The `CHILD` function controls all aspects of the pseudo-structural selectors. It can be used in various flavours to target different elements based on their position in the DOM tree. However there are only three main 'overloaded' functions that can be used:

- `CHILD(<location-keyword>)`
- `CHILD(<location-keyword>, <nth-expression>)`
- `CHILD(<keyword>)`

### Arguments Quick Reference

| Argument             | Required | Default Value | Allowed Keywords                                                                                       |
| -------------------- | :------: | :-----------: | ------------------------------------------------------------------------------------------------------ |
| `<location-keyword>` |    ❌    |    `FIRST`    | `FIRST`, `LAST`                                                                                        |
| `<nth-expression>`   |    ✔    |      ➖       | `ODD`, `EVEN`, `2N+1` - [the nth expression](#nth-expression) |
| `<keyword>`          |    ✔    |      ➖       | `ONLY`, `EMPTY`, `ROOT`                                                                                |

### Location Keyword

The location keyword specifies the position of the element in relation to its parent. It can be one of the following:

- `FIRST`: The first child of its parent.
- `LAST`: The last child of its parent.

### Nth Expression

The nth expression is used to target elements based on their position in the DOM tree. Please refer to the [W3C documentation](https://www.w3.org/TR/selectors-3/#nth-child-pseudo) for more information on the nth expression.

It can be one of the following:

- `an+b`: Selects every nth element.
- `ODD`: Selects every odd element.
- `EVEN`: Selects every even element.

### Keyword

The keyword specifies the type of element to target. It can be one of the following:

- `ONLY`: The only child of its parent.
- `EMPTY`: An element that has no children (including text nodes).
- `ROOT`: The root of the document.


## The `TYPEOF` Function

The `TYPEOF` function is used to target elements based on their type. It can be used in conjunction with the `CHILD` function to target elements based on their position and type. In this case the the notation `CHILD() AS TYPEOF` is used to target the first sibling of its type.

In short, use `AS TYPEOF` to target the specified element type. This will handle all CSS selectors where `of-type` is used.

#### Here's an example to illustrate:

<Tabs groupId="sql-css">
<TabItem value="sql" label="SQL">

```sql
SELECT * FROM DOM WHERE
TAG('p') AND CHILD(LAST) AS TYPEOF
```

</TabItem>
<TabItem value="css" label="CSS">

```css
p:last-of-type {
  /* Styles */
}
```

</TabItem>
</Tabs>

:::info

In a effort to reduce visual clutter, the `TYPEOF` function does not require you to specify parentheses `()` when used in conjunction with the `CHILD` function. You may specify the parentheses if you wish, but they are not required.

:::
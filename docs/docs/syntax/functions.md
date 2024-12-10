import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Functions

In Jelly SQL functions are used to perform shorthand operations on elements. Functions are used to target specific elements or to perform operations on the elements that match the query. Functions are not case sensitive.

:::warning

Jelly SQL is not strict with the amount of arguments passed to a function. It will only parse the first few expected arguments. With that said, it is recommended to use the correct amount of arguments to avoid any parsing issues. Stricter validation may be enforced in future versions.

:::

# Structure

Functions are composed of the function name followed by a set of parentheses `()` containing the arguments. The arguments are separated by commas `,`. Functions can have zero or more arguments.

Here's an example of a function with arguments:

```sql
SELECT * FROM DOM WHERE
ATTRIBUTE('data-color') = 'orange'
```

Some functions may have a keyword equivalent (`ATTRIBUTE` for instance), thus functions with zero arguments still require the parentheses `()` to be present. *Note: `TYPEOF` is the only exception to this rule, as it is always parsed as a function.*

Here's an example of a function without arguments:

```sql
SELECT * FROM DOM WHERE
CHILD()
```
# Arguments

Arguments are values that are passed to a function. The number of arguments that a function can accept is determined by the function definition.

Arguments can be of any common type parsed by the tokenizer, but common ones include:

- Keywords
- Expressions (Math)
- Strings
- Numbers

## Whitespace and Indentation

Whitespace is mostly ignored when parsing arguments, so you can pad, indent, or space out arguments as needed.

The only conditions are:

- The function name must be followed by an opening parenthesis `(`. No whitespace is allowed between the function name and the opening parenthesis.
- The closing parenthesis `)` must be directly after the last argument. No whitespace is allowed between the closing parenthesis and the last argument.

Here's an example of a function with arguments that are padded:

<Tabs>
<TabItem value="ex_1" label="Valid 1">

```sql
SELECT * FROM DOM WHERE
CHILD(FIRST, 2N + 1)
```

</TabItem>
<TabItem value="ex_2" label="Valid 2">

```sql
SELECT * FROM DOM WHERE
CHILD(
    FIRST,
    2N + 1)
```

</TabItem>

<TabItem value="inv_ex_1" label="Invalid 1">

```js
SELECT * FROM DOM WHERE
/* highlight-next-line-error */
CHILD(FIRST, 2N + 1 )
```

</TabItem>

<TabItem value="inv_ex_2" label="Invalid 2">

```js
SELECT * FROM DOM WHERE
/* highlight-start-error */
CHILD(
    FIRST,
    2N + 1
)
/* highlight-end-error */
```

</TabItem>
</Tabs>


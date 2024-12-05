# Comments

Comments are used to document your code. They are ignored by the parser and are not executed. Comments can be used to explain what the code does, why it does it, or how it works. Comments can also be used to temporarily disable SQL.

Jelly SQL follows the typical SQL comment syntax. There are two types of comments:

- Single-line comments - `--`
- Multi-line comments - `/* */`

## Single-line Comments

Single-line comments start with `--` and continue until the end of the line. They are used to add comments to a single line of code.

Here's an example of a single-line comment:

```sql {2-3}
-- This is a single-line comment
SELECT * FROM DOM WHERE
TAG = 'p' -- Filter by paragraph tags
-- AND CLASS = 'body' -- Disabled code example
```

## Multi-line Comments

Multi-line comments start with `/*` and end with `*/`. They are used to add comments that span multiple lines of code.

Here's an example of a multi-line comment:

```sql {6-7,10}
/*
This is a multi-line comment
It can span multiple lines
*/

SELECT * FROM DOM WHERE
TAG = 'p' /* Can be used as a single-line comment */

/* AND CLASS = 'body' -- Disabled code example
 AND ATTRIBUTE('data-color') = 'green' */ OR TAG = 'div'
```
---
sidebar_position: 9999
---

# Limitations

JellySQL has some limitations that you should be aware of when using it. These limitations aren't due to any technological constraints, but rather that it has not yet been implemented.

- **Complex Combinators**: There are cases where completely valid CSS combinator selectors may not be supported by Jelly SQL. For more information, see the [combinator limitation](./selectors/combinators.md#limitations) section.
- **Grouping Expressions**: Only shallow grouping is supported. For more information, see the [grouping expressions limitation](./syntax/logical-grouping.md#limitations) section.
- **Namespaces**: Jelly SQL does not yet support namespaces as defined in the W3C specification. This is planned for a future release. For more information, see below from the W3C specification:
    - [Type selectors and namespaces](https://www.w3.org/TR/selectors-3/#typenmsp)
    - [Universal selectors and namespaces](https://www.w3.org/TR/selectors-3/#univnmsp)
    - [Attribute selectors and namespaces](https://www.w3.org/TR/selectors-3/#attrnmsp)
- **Attribute-Selectors (hyphen-separated)**: Jelly SQL does not yet support attribute selectors with hyphen-separated values. This is planned for a future release. For more information, see below from the W3C specification:
    - [Hyphen-separated attribute selectors](https://www.w3.org/TR/selectors-3/#attribute-representation)
- **Sub-Queries**: There are no support for sub-queries. Specifically for the `:not(s)` negation pseudo-class. CSS does allow [simple selectors](https://www.w3.org/TR/selectors-3/#simple-selectors-dfn) to be defined in the negation pseudo-class. However, at a core level, Jelly SQL does not yet support [simple selectors](https://www.w3.org/TR/selectors-3/#simple-selectors-dfn) to be defined in a active query. In the meantime, separate queries need to be ran and joined to allow for this on a API level. For more information, see below from the W3C specification:
    - [Negation pseudo-class](https://www.w3.org/TR/selectors-3/#negation)
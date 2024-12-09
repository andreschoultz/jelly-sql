import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# `lang()` Pseudo-Class

The `lang()` pseudo-class is used to target elements based on the language of the text content. It allows you to select elements that have a specific language attribute or that contain text in a specific language.

## The Function

The `lang()` function is defined as `LANG('<language-code>')` or `LANGUAGE('<language-code>')`.

<Tabs groupId="sql-css">
<TabItem value="sql" label="SQL">

```sql
SELECT * FROM DOM WHERE
TAG('p') AND LANG('en')
```

</TabItem>
<TabItem value="css" label="CSS">

```css
p:lang(en) {
  /* Styles */
}
```

</TabItem>
</Tabs>
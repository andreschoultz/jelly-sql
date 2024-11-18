## Compound Expression Reference (Basic)

#### Javascript QuerySelector: `'a[href*="jellysql.com"], button[onclick*="jellysql.com"]'`
``` sql
SELECT * FROM DOM WHERE
    (Tag = 'a' AND  Attribute('href') LIKE 'jellysql.com')
 OR (Tag = 'button' AND Attribute('onclick') LIKE 'jellysql.com')
```

####  JavaScript QuerySelector: `'a[href*="jellysql.com"], a[onclick*="jellysql.com"]'`
```sql
SELECT * FROM DOM WHERE
    Tag = 'a'
AND (Attribute('href') LIKE 'jellysql.com' OR Attribute('onclick') LIKE 'jellysql.com')
 ```

#### JavaScript QuerySelector: `'a[href*="jellysql.com"][onclick*="jellysql.com"]'`
```sql
SELECT * FROM DOM WHERE
    Tag = 'a'
AND Attribute('href') LIKE 'jellysql.com'
AND Attribute('onclick') LIKE 'jellysql.com'
```

## Combinators

#### Reference HTML

```html
<div>
    Text as a direct child of a div. (#1)
    <p>A paragraph directly inside a div. (#2)</p>
    <div>
        <p data-color="green">A paragraph nested inside two div. (#3)</p>
        <span class="text-blue">
            <p>A paragraph inside a span, nested inside two div. (#4)</p>
        </span>
    </div>
    <span>
        <p data-color="orange">A paragraph nested inside a span, and then a div. (#5)</p>
    </span>
</div>
<p>A paragraph in the DOM root. (#6)</p>
<p data-color="yellow">A second paragraph in the DOM root. (#7)</p>
```

### Child & Descendant - `>`, ` ` (whitespace)

#### JavaScript QuerySelector: `'div > p'`

##### Selects HTML:
```html
<p>A paragraph directly inside a div. (#2)</p>
<p data-color="green">A paragraph nested inside two div. (#3)</p>
```

##### With SQL:

```sql
SELECT * FROM DOM WHERE
TAG('p') CHILD OF TAG('div')
```

```sql
SELECT * FROM DOM WHERE
TAG = 'p' CHILD OF TAG = 'div'
```

#### JavaScript QuerySelector: `'div p'`

##### Selects HTML:
```html
<p>A paragraph directly inside a div. (#2)</p>
<p data-color="green">A paragraph nested inside two div. (#3)</p>
<p>A paragraph inside a span, nested inside two div. (#4)</p>
<p data-color="orange">A paragraph nested inside a span, and then a div. (#5)</p>
```
##### With SQL:

```sql
SELECT * FROM DOM WHERE
TAG('p') WITHIN TAG('div')
```

```sql
SELECT * FROM DOM WHERE
TAG = 'p' WITHIN TAG = 'div'
```

#### JavaScript QuerySelector: `'div > div > p'`

##### Selects HTML:
```html
<p data-color="green">A paragraph nested inside two div. (#3)</p>
```

##### With SQL:

```sql
SELECT * FROM DOM WHERE
TAG('p') CHILD OF TAG('div') AND CHILD OF TAG('div')
```

```sql
SELECT * FROM DOM WHERE
TAG = 'p' CHILD OF TAG = 'div' AND CHILD OF TAG = 'div'
```

#### JavaScript QuerySelector: `'div > div p'`

##### Selects HTML:
```html
<p data-color="green">A paragraph nested inside two div. (#3)</p>
<p>A paragraph inside a span, nested inside two div. (#4)</p>
```

##### With SQL:

```sql
SELECT * FROM DOM WHERE
TAG('p') WITHIN TAG('div') AND CHILD OF TAG('div')
```

```sql
SELECT * FROM DOM WHERE
TAG = 'p' WITHIN TAG = 'div' AND CHILD OF TAG = 'div'
```

#### JavaScript QuerySelector: `'div p[data-color="orange"]'`

##### Selects HTML:
```html
<p data-color="orange">A paragraph nested inside a span, and then a div. (#5)</p>
```

##### With SQL:

```sql
SELECT * FROM DOM WHERE
(TAG = 'p' AND ATTRIBUTE('data-color') = 'orange') WITHIN TAG('div')
```

```sql
SELECT * FROM DOM WHERE
(TAG = 'p' AND ATTRIBUTE('data-color') = 'orange') WITHIN TAG = 'div'
```

#### JavaScript QuerySelector: `'div > p, span.text-blue'`

##### Selects HTML:
```html
<p>A paragraph directly inside a div. (#2)</p>
<p data-color="green">A paragraph nested inside two div. (#3)</p>
<p>A paragraph inside a span, nested inside two div. (#4)</p>
```
##### With SQL:

```sql
SELECT * FROM DOM WHERE
    TAG('p') CHILD OF TAG('div')
OR  (TAG = 'span' AND CLASS = 'text-blue')
```

```sql
SELECT * FROM DOM WHERE
    TAG = 'p' CHILD OF TAG = 'div'
OR  TAG = 'span' AND CLASS = 'text-blue'
```

### Siblings - `+`, `~`

#### JavaScript  QuerySelector: `'div + p'`

##### Selects HTML:
```html
<p>A paragraph in the DOM root. (#6)</p>
```
##### With SQL:

```sql
SELECT * FROM DOM WHERE
TAG('p') NEXT TO TAG('div')
```

```sql
SELECT * FROM DOM WHERE
TAG = 'p' NEXT TO TAG = 'div'
```

#### JavaScript  QuerySelector: `'div ~ p'`

##### Selects HTML:
```html
<p>A paragraph in the DOM root. (#6)</p>
<p data-color="yellow">A second paragraph in the DOM root. (#7)</p>
```
##### With SQL:

```sql
SELECT * FROM DOM WHERE
TAG('p') SIBLING OF TAG('div')
```

```sql
SELECT * FROM DOM WHERE
TAG = 'p' SIBLING OF TAG = 'div'
```

### Mix of Everything

#### JavaScript  QuerySelector: `'div > span > p[data-color="orange"], div [data-color], div > div p + span.text-blue, div ~ p'`

##### Selects HTML:
```html
<p data-color="green">A paragraph nested inside two div. (#3)</p>
<p>A paragraph inside a span, nested inside two div. (#4)</p>
<p data-color="orange">A paragraph nested inside a span, and then a div. (#5)</p>
<p>A paragraph in the DOM root. (#6)</p>
<p data-color="yellow">A second paragraph in the DOM root. (#7)</p>
```
##### With SQL:

```sql
SELECT * FROM DOM WHERE
    ((TAG = 'p' AND ATTRIBUTE('data-color') = 'orange') CHILD OF TAG('div') AND CHILD OF TAG('div'))
OR  (Attribute('data-color') WITHIN TAG('div'))
OR  ((TAG = 'span' AND CLASS = 'text-blue') NEXT TO TAG('p') AND WITHIN TAG('div') AND CHILD OF TAG('div'))
OR  (TAG('p') SIBLING OF TAG('div'))
```

## Pseudo Selectors

### Structural

#### Proposed functions

##### Location: `:first-child`, `:last-child`

```sql
CHILD({location-keyword})
```

Ex.

```sql
CHILD(FIRST) -- FIRST, LAST
```

##### `n-th` Selector: `:nth-child(n)`

```sql
CHILD({nth-sum})

CHILD({nth-keyword})
```

Ex.

```sql
CHILD(2N) -- 2N, 2N+1, 3N-1, 3N-2

CHILD(ODD) -- ODD, EVEN
```

##### Location + `n-th` Selector: `:nth-last-child(n)`, `:nth-child(n)`

```sql
CHILD({location-keyword}, {nth-sum})

CHILD({location-keyword}, {nth-keyword})
```

Ex.

```sql
CHILD(FIRST, 2N+1) -- Same as CHILD(2N+1)

CHILD(LAST, 2N+1)
__

CHILD(FIRST, ODD) -- Same as CHILD(ODD)

CHILD(LAST, ODD)
```

##### Keyword: `:only-child`, `:empty`

```sql
CHILD({keyword})
```

Ex.

```sql
CHILD(ONLY) -- ONLY, EMPTY
```

##### `of-type` Selector: `:nth-of-type(n)`, `:nth-last-of-type(n)`, `:first-of-type`, `:last-of-type`, `:only-of-type`

```sql
CHILD() AS TYPEOF

CHILD({location-keyword}) AS TYPEOF

CHILD({nth-keyword}) AS TYPEOF

CHILD({location-keyword}, {nth-keyword}) AS TYPEOF

CHILD({keyword}) AS TYPEOF
```

Ex.

```sql
CHILD() AS TYPEOF -- Same as CHILD(FIRST) AS TYPEOF

CHILD(LAST) AS TYPEOF

CHILD(2N+1) AS TYPEOF -- Same as CHILD(FIRST, 2N+1) AS TYPEOF

CHILD(LAST, 2N+1) AS TYPEOF

CHILD(ONLY) AS TYPEOF
```
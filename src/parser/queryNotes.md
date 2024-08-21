### Compound Expression Reference (Basic)

#### Javascript QuerySelector: `'a[href*="jellysql.com"], button[onclick*="jellysql.com"]'`
``` sql
SELECT * FROM DOM WHERE
    (Tag = 'a' AND  Attribute('href') LIKE 'jellysql.com')
 OR (Tag = 'button' AND Attribute('onclick') LIKE 'jellysql.com')
```

####  Javascript QuerySelector: `'a[href*="jellysql.com"], a[onclick*="jellysql.com"]'`
```sql
SELECT * FROM DOM WHERE
    Tag = 'a'
AND (Attribute('href') LIKE 'jellysql.com' OR Attribute('onclick') LIKE 'jellysql.com')
 ```

#### Javascript QuerySelector: `'a[href*="jellysql.com"][onclick*="jellysql.com"]'`
```sql
SELECT * FROM DOM WHERE
    Tag = 'a'
AND Attribute('href') LIKE 'jellysql.com'
AND Attribute('onclick') LIKE 'jellysql.com'
```
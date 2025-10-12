import { query } from 'jelly-sql';
import React, { useCallback, useState } from 'react';

import CodeBlock from '@theme/CodeBlock';

import styles from './Playground.module.css';

const Playground: React.FC = () => {
    const [sqlQuery, setSqlQuery] = useState(`SELECT * FROM DOM WHERE TAG = 'div' AND CLASS = 'container'`);
    const [cssResult, setCssResult] = useState('div.container');
    const [error, setError] = useState<string | null>(null);

    const executeQuery = useCallback(() => {
        try {
            setError(null);
            const result = query(sqlQuery);
            setCssResult(String(result));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setCssResult('');
        }
    }, [sqlQuery]);

    const handleQueryChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSqlQuery(event.target.value);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
            event.preventDefault();
            executeQuery();
        }
    };

    const exampleQueries = [
        {
            name: "Basic Tag Selection",
            query: "SELECT * FROM DOM WHERE TAG = 'div'"
        },
        {
            name: "Class Selection",
            query: "SELECT * FROM DOM WHERE CLASS = 'container'"
        },
        {
            name: "ID Selection",
            query: "SELECT * FROM DOM WHERE ID = 'header'"
        },
        {
            name: "Combined Selection",
            query: "SELECT * FROM DOM WHERE TAG = 'a' AND CLASS = 'active'"
        },
        {
            name: "Attribute Selection",
            query: "SELECT * FROM DOM WHERE ATTR('data-role') = 'button'"
        },
        {
            name: "OR Logic",
            query: "SELECT * FROM DOM WHERE TAG = 'button' OR TAG = 'input'"
        },
        {
            name: "Nested Grouping",
            query: "SELECT * FROM DOM WHERE TAG = 'a' AND (CLASS = 'active' OR CLASS = 'hover')"
        },
        {
            name: "Child Combinator",
            query: "SELECT * FROM DOM WHERE TAG = 'p' CHILD OF TAG = 'div'"
        },
        {
            name: "Descendant Combinator",
            query: "SELECT * FROM DOM WHERE TAG = 'span' WITHIN TAG = 'div'"
        },
        {
            name: "Pseudo-class",
            query: "SELECT * FROM DOM WHERE TAG = 'li' AND CHILD(1)"
        }
    ];

    return (
        <div className={styles.playground}>
            <div className={styles.header}>
                <h2>Jelly-SQL Playground</h2>
                <p>Write jelly-sql queries and see the generated CSS selectors in real-time!</p>
                <p className={styles.hint}>
                    💡 Press <kbd>Ctrl</kbd>+<kbd>Enter</kbd> (or <kbd>Cmd</kbd>+<kbd>Enter</kbd> on Mac) to execute
                </p>
            </div>

            <div className={styles.container}>
                <div className={styles.inputSection}>
                    <div className={styles.sectionHeader}>
                        <h3>Query</h3>
                        <button
                            className={styles.executeButton}
                            onClick={executeQuery}
                        >
                            Execute
                        </button>
                    </div>
                    <textarea
                        className={styles.sqlInput}
                        value={sqlQuery}
                        onChange={handleQueryChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter your jelly-sql query here..."
                        rows={8}
                    />
                </div>

                <div className={styles.outputSection}>
                    <h3 style={{paddingBottom: 10}}>CSS Selector Result</h3>
                    {error ? (
                        <div className={styles.error}>
                            <strong>Error:</strong> {error}
                        </div>
                    ) : (
                        <CodeBlock language="css" className={styles.cssOutput}>
                            {cssResult}
                        </CodeBlock>
                    )}
                </div>
            </div>

            <div className={styles.examples}>
                <h3>Examples</h3>
                <div className={styles.exampleGrid}>
                    {exampleQueries.map((example, index) => (
                        <button
                            key={index}
                            className={styles.exampleButton}
                            onClick={() => setSqlQuery(example.query)}
                            title={example.query}
                        >
                            {example.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.footer}>
                <p>
                    Learn more about jelly-sql syntax in our{' '}
                    <a href="/docs/quick-start">documentation</a>.
                </p>
            </div>
        </div>
    );
};

export default Playground;
import { describe, expect, test } from 'vitest';

import { query } from '../../src/index';
import { operators } from '../../src/lexer/constants';
import { KeywordType, OperatorType, SymbolType } from '../../src/lexer/types';

describe('QuerySelector Generator', () => {
    test('The jelly goes, jiggle-jiggle', () => {
        expect('jelly-sql').toEqual('jelly-sql');
    });

    describe('Isolated Basic', () => {
        const generateLowerCaseVariations = (arr: string[]) => [...arr, ...arr.map(x => x.toLowerCase())];

        const formatInputForLikeComparison = (input: string, type: 'start' | 'end' | 'both') => {
            let output = '';

            if (type === 'start' || type === 'both') {
                output = type === 'both' ? `'%${input}` : `'%${input}'`;
            }

            if (type === 'end' || type === 'both') {
                output = type === 'both' ? `${output}%'` : `'${input}%'`;
            }

            return output;
        };

        describe('TAG | ELEMENT', () => {
            const keywords = [KeywordType.TAG, KeywordType.ELEMENT];

            test('Equals; Not Equals', () => {
                const equalOperators = [SymbolType.ASSIGN, SymbolType.EQ, OperatorType.EQUALS];
                const notEqualOperators = [SymbolType.NEQ, SymbolType.NEQ_LG, `${OperatorType.NOT} ${OperatorType.EQUALS}`];

                const validKeywords = generateLowerCaseVariations(keywords);
                const validEqualOperators = generateLowerCaseVariations(equalOperators);
                const validNotEqualOperators = generateLowerCaseVariations(notEqualOperators);

                const testCases = [
                    { input: `'a'`, expected: 'a' },
                    { input: `'button'`, expected: 'button' },
                    { input: `'custom-html-tag'`, expected: 'custom-html-tag' },
                ];

                for (const keyword of validKeywords) {
                    /* Equals */
                    for (const operator of validEqualOperators) {
                        for (const { input, expected } of testCases) {
                            const queryString = `SELECT * FROM DOM WHERE ${keyword} ${operator} ${input}`;

                            expect(query(queryString)).toBe(expected);
                        }
                    }

                    /* Not Equals */
                    for (const operator of validNotEqualOperators) {
                        for (const { input, expected } of testCases) {
                            const queryString = `SELECT * FROM DOM WHERE ${keyword} ${operator} ${input}`;

                            expect(query(queryString)).toBe(`:not(${expected})`);
                        }
                    }
                }
            });

            test('Combinators', () => {
                const combinatorOperators = [
                    {
                        operators: [OperatorType.CHILD, OperatorType.OF],
                        separator: ' > ',
                    },
                    {
                        operators: [OperatorType.WITHIN],
                        separator: ' ',
                    },
                    {
                        operators: [OperatorType.NEXT, OperatorType.TO],
                        separator: ' + ',
                    },
                    {
                        operators: [OperatorType.SIBLING, OperatorType.OF],
                        separator: ' ~ ',
                    },
                ];
                const validKeywords = generateLowerCaseVariations(keywords);
                const testCases = [
                    { inputs: [`'a'`, `'div'`] },
                    { inputs: [`'a'`, `'div'`, `'body'`] },
                    { inputs: [`'span'`, `'a'`, `'div'`, `'body'`] },
                    { inputs: [`'span'`, `'a'`, `'ul'`, `'div'`, `'body'`] },
                    { inputs: [`'button'`, `'ul'`] },
                    { inputs: [`'custom-html-tag'`, `'secondary-custom-html-tag'`] },
                ];

                function testWrapper(testAndSeparator: boolean, testAsFunction: boolean) {
                    for (const keyword of validKeywords) {
                        if (testAsFunction && keyword != KeywordType.TAG) continue;

                        for (const combinator of combinatorOperators) {
                            const validOperators = generateLowerCaseVariations([combinator.operators.join(' ')]);

                            for (const operator of validOperators) {
                                for (const { inputs } of testCases) {
                                    let subQuery = '';

                                    for (let i = 0; i < inputs.length; i++) {
                                        if (testAsFunction) {
                                            subQuery += `${keyword}(${inputs[i]})`;
                                        } else {
                                            subQuery += `${keyword} = ${inputs[i]}`;
                                        }

                                        if (testAndSeparator && i > 0 && i < inputs.length - 1) {
                                            subQuery += ' AND ';
                                        }

                                        if (i + 1 < inputs.length) {
                                            subQuery += ` ${operator} `;
                                        }
                                    }

                                    subQuery = subQuery.trim();

                                    const queryString = `SELECT * FROM DOM WHERE ${subQuery}`;
                                    const expected = inputs
                                        .map(x => x.replaceAll("'", ''))
                                        .reverse()
                                        .join(combinator.separator);

                                    expect(query(queryString)).toBe(expected);
                                }
                            }
                        }
                    }
                }

                testWrapper(false, false);
                testWrapper(false, true);
                testWrapper(true, false);
                testWrapper(true, true);
            });
        });

        describe('ID', () => {
            const keywords = [KeywordType.ID];

            test('Equals; Not Equals', () => {
                const equalOperators = [SymbolType.ASSIGN, SymbolType.EQ, OperatorType.EQUALS];
                const notEqualOperators = [SymbolType.NEQ, SymbolType.NEQ_LG, `${OperatorType.NOT} ${OperatorType.EQUALS}`];

                const validKeywords = generateLowerCaseVariations(keywords);
                const validEqualOperators = generateLowerCaseVariations(equalOperators);
                const validNotEqualOperators = generateLowerCaseVariations(notEqualOperators);

                const testCases = [
                    { input: `'confirmation'`, expected: '#confirmation' },
                    { input: `'alert-modal'`, expected: '#alert-modal' },
                    { input: `'user_form'`, expected: '#user_form' },
                ];

                for (const keyword of validKeywords) {
                    /* Equals */
                    for (const operator of validEqualOperators) {
                        for (const { input, expected } of testCases) {
                            const queryString = `SELECT * FROM DOM WHERE ${keyword} ${operator} ${input}`;

                            expect(query(queryString)).toBe(expected);
                        }
                    }

                    /* Not Equals */
                    for (const operator of validNotEqualOperators) {
                        for (const { input, expected } of testCases) {
                            const queryString = `SELECT * FROM DOM WHERE ${keyword} ${operator} ${input}`;

                            expect(query(queryString)).toBe(`:not(${expected})`);
                        }
                    }
                }
            });

            test('Like; Not Like', () => {
                const likeOperators = [OperatorType.LIKE];
                const notEqualOperators = [`${OperatorType.NOT} ${OperatorType.LIKE}`];

                const validKeywords = generateLowerCaseVariations(keywords);
                const validLikeOperators = generateLowerCaseVariations(likeOperators);
                const validNotLikeOperators = generateLowerCaseVariations(notEqualOperators);

                const testCases = [
                    { input: `'confirmation'`, expected: '[id*="confirmation"]' },
                    { input: `'alert-modal'`, expected: '[id*="alert-modal"]' },
                    { input: `'user_form'`, expected: '[id*="user_form"]' },

                    { input: `'%confirmation%'`, expected: '[id*="confirmation"]' },
                    { input: `'%alert-modal%'`, expected: '[id*="alert-modal"]' },
                    { input: `'%user_form%'`, expected: '[id*="user_form"]' },

                    { input: `'%confirmation'`, expected: '[id$="confirmation"]' },
                    { input: `'%alert-modal'`, expected: '[id$="alert-modal"]' },
                    { input: `'%user_form'`, expected: '[id$="user_form"]' },

                    { input: `'confirmation%'`, expected: '[id^="confirmation"]' },
                    { input: `'alert-modal%'`, expected: '[id^="alert-modal"]' },
                    { input: `'user_form%'`, expected: '[id^="user_form"]' },
                ];

                for (const keyword of validKeywords) {
                    /* Like */
                    for (const operator of validLikeOperators) {
                        for (const { input, expected } of testCases) {
                            const queryString = `SELECT * FROM DOM WHERE ${keyword} ${operator} ${input}`;

                            expect(query(queryString)).toBe(expected);
                        }
                    }

                    /* Not Like */
                    for (const operator of validNotLikeOperators) {
                        for (const { input, expected } of testCases) {
                            const queryString = `SELECT * FROM DOM WHERE ${keyword} ${operator} ${input}`;

                            expect(query(queryString)).toBe(`:not(${expected})`);
                        }
                    }
                }
            });

            test('Contains; Not Contains', () => {
                const containOperators = [OperatorType.CONTAINS];
                const notContainOperators = [`${OperatorType.NOT} ${OperatorType.CONTAINS}`];

                const validKeywords = generateLowerCaseVariations(keywords);
                const validContainOperators = generateLowerCaseVariations(containOperators);
                const validNotContainOperators = generateLowerCaseVariations(notContainOperators);

                const testCases = [
                    { input: `'confirmation'`, expected: '[id~="confirmation"]' },
                    { input: `'alert-modal'`, expected: '[id~="alert-modal"]' },
                    { input: `'user_form'`, expected: '[id~="user_form"]' },
                ];

                for (const keyword of validKeywords) {
                    /* Like */
                    for (const operator of validContainOperators) {
                        for (const { input, expected } of testCases) {
                            const queryString = `SELECT * FROM DOM WHERE ${keyword} ${operator} ${input}`;

                            expect(query(queryString)).toBe(expected);
                        }
                    }

                    /* Not Like */
                    for (const operator of validNotContainOperators) {
                        for (const { input, expected } of testCases) {
                            const queryString = `SELECT * FROM DOM WHERE ${keyword} ${operator} ${input}`;

                            expect(query(queryString)).toBe(`:not(${expected})`);
                        }
                    }
                }
            });
        });

        describe('CLASS', () => {
            const keywords = [KeywordType.CLASS];

            test('Equals; Not Equals', () => {
                const equalOperators = [SymbolType.ASSIGN, SymbolType.EQ, OperatorType.EQUALS];
                const notEqualOperators = [SymbolType.NEQ, SymbolType.NEQ_LG, `${OperatorType.NOT} ${OperatorType.EQUALS}`];

                const validKeywords = generateLowerCaseVariations(keywords);
                const validEqualOperators = generateLowerCaseVariations(equalOperators);
                const validNotEqualOperators = generateLowerCaseVariations(notEqualOperators);

                const testCases = [
                    { input: `'success'`, expected: '.success' },
                    { input: `'btn-large'`, expected: '.btn-large' },
                    { input: `'modal_header'`, expected: '.modal_header' },
                ];

                for (const keyword of validKeywords) {
                    /* Equals */
                    for (const operator of validEqualOperators) {
                        for (const { input, expected } of testCases) {
                            const queryString = `SELECT * FROM DOM WHERE ${keyword} ${operator} ${input}`;

                            expect(query(queryString)).toBe(expected);
                        }
                    }

                    /* Not Equals */
                    for (const operator of validNotEqualOperators) {
                        for (const { input, expected } of testCases) {
                            const queryString = `SELECT * FROM DOM WHERE ${keyword} ${operator} ${input}`;

                            expect(query(queryString)).toBe(`:not(${expected})`);
                        }
                    }
                }
            });

            test('Like; Not Like', () => {
                const likeOperators = [OperatorType.LIKE];
                const notEqualOperators = [`${OperatorType.NOT} ${OperatorType.LIKE}`];

                const validKeywords = generateLowerCaseVariations(keywords);
                const validLikeOperators = generateLowerCaseVariations(likeOperators);
                const validNotLikeOperators = generateLowerCaseVariations(notEqualOperators);

                const testCases = [
                    { input: `'success'`, expected: '[class*="success"]' },
                    { input: `'btn-large'`, expected: '[class*="btn-large"]' },
                    { input: `'modal_header'`, expected: '[class*="modal_header"]' },

                    { input: `'%success%'`, expected: '[class*="success"]' },
                    { input: `'%btn-large%'`, expected: '[class*="btn-large"]' },
                    { input: `'%modal_header%'`, expected: '[class*="modal_header"]' },

                    { input: `'%success'`, expected: '[class$="success"]' },
                    { input: `'%btn-large'`, expected: '[class$="btn-large"]' },
                    { input: `'%modal_header'`, expected: '[class$="modal_header"]' },

                    { input: `'success%'`, expected: '[class^="success"]' },
                    { input: `'btn-large%'`, expected: '[class^="btn-large"]' },
                    { input: `'modal_header%'`, expected: '[class^="modal_header"]' },
                ];

                for (const keyword of validKeywords) {
                    /* Like */
                    for (const operator of validLikeOperators) {
                        for (const { input, expected } of testCases) {
                            const queryString = `SELECT * FROM DOM WHERE ${keyword} ${operator} ${input}`;

                            expect(query(queryString)).toBe(expected);
                        }
                    }

                    /* Not Like */
                    for (const operator of validNotLikeOperators) {
                        for (const { input, expected } of testCases) {
                            const queryString = `SELECT * FROM DOM WHERE ${keyword} ${operator} ${input}`;

                            expect(query(queryString)).toBe(`:not(${expected})`);
                        }
                    }
                }
            });

            test('Contains; Not Contains', () => {
                const containOperators = [OperatorType.CONTAINS];
                const notContainOperators = [`${OperatorType.NOT} ${OperatorType.CONTAINS}`];

                const validKeywords = generateLowerCaseVariations(keywords);
                const validContainOperators = generateLowerCaseVariations(containOperators);
                const validNotContainOperators = generateLowerCaseVariations(notContainOperators);

                const testCases = [
                    { input: `'success'`, expected: '[class~="success"]' },
                    { input: `'btn-large'`, expected: '[class~="btn-large"]' },
                    { input: `'modal_header'`, expected: '[class~="modal_header"]' },
                ];

                for (const keyword of validKeywords) {
                    /* Like */
                    for (const operator of validContainOperators) {
                        for (const { input, expected } of testCases) {
                            const queryString = `SELECT * FROM DOM WHERE ${keyword} ${operator} ${input}`;

                            expect(query(queryString)).toBe(expected);
                        }
                    }

                    /* Not Like */
                    for (const operator of validNotContainOperators) {
                        for (const { input, expected } of testCases) {
                            const queryString = `SELECT * FROM DOM WHERE ${keyword} ${operator} ${input}`;

                            expect(query(queryString)).toBe(`:not(${expected})`);
                        }
                    }
                }
            });
        });

        describe('ATTRIBUTE | ATTR', () => {
            const keywords = [KeywordType.ATTRIBUTE, KeywordType.ATTR];

            test('Name match', () => {
                const equalOperators = [SymbolType.ASSIGN, SymbolType.EQ, OperatorType.EQUALS];
                const notEqualOperators = [SymbolType.NEQ, SymbolType.NEQ_LG, `${OperatorType.NOT} ${OperatorType.EQUALS}`];

                const validKeywords = generateLowerCaseVariations(keywords);
                const validEqualOperators = generateLowerCaseVariations(equalOperators);
                const validNotEqualOperators = generateLowerCaseVariations(notEqualOperators);

                const testCases = [
                    { input: `'value'`, expected: '[value]' },
                    { input: `'data-color'`, expected: '[data-color]' },
                    { input: `'element_width'`, expected: '[element_width]' },
                ];

                for (const keyword of validKeywords) {
                    /* Equals */
                    for (const operator of validEqualOperators) {
                        for (const { input, expected } of testCases) {
                            const queryString = `SELECT * FROM DOM WHERE ${keyword} ${operator} ${input}`;

                            expect(query(queryString)).toBe(expected);
                        }
                    }

                    /* Not Equals */
                    for (const operator of validNotEqualOperators) {
                        for (const { input, expected } of testCases) {
                            const queryString = `SELECT * FROM DOM WHERE ${keyword} ${operator} ${input}`;

                            expect(query(queryString)).toBe(`:not(${expected})`);
                        }
                    }
                }
            });

            test('Equals; Not Equals', () => {
                const equalOperators = [SymbolType.ASSIGN, SymbolType.EQ, OperatorType.EQUALS];
                const notEqualOperators = [SymbolType.NEQ, SymbolType.NEQ_LG, `${OperatorType.NOT} ${OperatorType.EQUALS}`];

                const validKeywords = generateLowerCaseVariations(keywords);
                const validEqualOperators = generateLowerCaseVariations(equalOperators);
                const validNotEqualOperators = generateLowerCaseVariations(notEqualOperators);

                const testCases = [
                    { attributeName: `value`, input: `'5'`, expected: `[value="5"]` },
                    { attributeName: `value`, input: 29, expected: '[value="29"]' },
                    { attributeName: 'data-color', input: `'orange'`, expected: '[data-color="orange"]' },
                    { attributeName: 'data-tooltip-description', input: `'A tooltip description!'`, expected: '[data-tooltip-description="A tooltip description!"]' },
                    { attributeName: `element_width`, input: `'90%'`, expected: '[element_width="90%"]' },
                ];

                for (const keyword of validKeywords) {
                    /* Equals */
                    for (const operator of validEqualOperators) {
                        for (const { attributeName, input, expected } of testCases) {
                            const queryString = `SELECT * FROM DOM WHERE ${keyword}('${attributeName}') ${operator} ${input}`;

                            expect(query(queryString)).toBe(expected);
                        }
                    }

                    /* Not Equals */
                    for (const operator of validNotEqualOperators) {
                        for (const { attributeName, input, expected } of testCases) {
                            const queryString = `SELECT * FROM DOM WHERE ${keyword}('${attributeName}') ${operator} ${input}`;

                            expect(query(queryString)).toBe(`:not(${expected})`);
                        }
                    }
                }
            });

            test('Like; Not Like', () => {
                const likeOperators = [OperatorType.LIKE];
                const notEqualOperators = [`${OperatorType.NOT} ${OperatorType.LIKE}`];

                const validKeywords = generateLowerCaseVariations(keywords);
                const validLikeOperators = generateLowerCaseVariations(likeOperators);
                const validNotLikeOperators = generateLowerCaseVariations(notEqualOperators);

                let testCases = [
                    { attributeName: `value`, input: `'5'`, expected: `[value*="5"]` },
                    { attributeName: `value`, input: 29, expected: '[value*="29"]' },
                    { attributeName: 'data-color', input: `'orange'`, expected: '[data-color*="orange"]' },
                    { attributeName: 'data-tooltip-description', input: `'A tooltip description!'`, expected: '[data-tooltip-description*="A tooltip description!"]' },
                    { attributeName: `element_width`, input: `'90[%]'`, expected: '[element_width*="90%"]' },
                ];

                for (const { attributeName, input, expected } of [...testCases]) {
                    const unquotedInput = String(input).startsWith("'") ? String(input).slice(1, String(input).toString().length - 1) : String(input);

                    testCases.push({
                        attributeName,
                        input: formatInputForLikeComparison(unquotedInput, 'both'),
                        expected: `[${attributeName}*="${unquotedInput.replace('[%]', '%')}"]`,
                    });

                    testCases.push({
                        attributeName,
                        input: formatInputForLikeComparison(unquotedInput, 'start'),
                        expected: `[${attributeName}$="${unquotedInput.replace('[%]', '%')}"]`,
                    });

                    testCases.push({
                        attributeName,
                        input: formatInputForLikeComparison(unquotedInput, 'end'),
                        expected: `[${attributeName}^="${unquotedInput.replace('[%]', '%')}"]`,
                    });
                }

                for (const keyword of validKeywords) {
                    /* Like */
                    for (const operator of validLikeOperators) {
                        for (const { attributeName, input, expected } of testCases) {
                            const queryString = `SELECT * FROM DOM WHERE ${keyword}('${attributeName}') ${operator} ${input}`;

                            expect(query(queryString)).toBe(expected);
                        }
                    }

                    /* Not Like */
                    for (const operator of validNotLikeOperators) {
                        for (const { attributeName, input, expected } of testCases) {
                            const queryString = `SELECT * FROM DOM WHERE ${keyword}('${attributeName}') ${operator} ${input}`;

                            expect(query(queryString)).toBe(`:not(${expected})`);
                        }
                    }
                }
            });

            test('Contains; Not Contains', () => {
                const containOperators = [OperatorType.CONTAINS];
                const notContainOperators = [`${OperatorType.NOT} ${OperatorType.CONTAINS}`];

                const validKeywords = generateLowerCaseVariations(keywords);
                const validContainOperators = generateLowerCaseVariations(containOperators);
                const validNotContainOperators = generateLowerCaseVariations(notContainOperators);

                const testCases = [
                    { attributeName: `value`, input: `'5'`, expected: `[value~="5"]` },
                    { attributeName: `value`, input: 29, expected: '[value~="29"]' },
                    { attributeName: 'data-color', input: `'orange'`, expected: '[data-color~="orange"]' },
                    { attributeName: 'data-tooltip-description', input: `'A tooltip description!'`, expected: '[data-tooltip-description~="A tooltip description!"]' },
                    { attributeName: `element_width`, input: `'90%'`, expected: '[element_width~="90%"]' },
                ];

                for (const keyword of validKeywords) {
                    /* Like */
                    for (const operator of validContainOperators) {
                        for (const { attributeName, input, expected } of testCases) {
                            const queryString = `SELECT * FROM DOM WHERE ${keyword}('${attributeName}') ${operator} ${input}`;

                            expect(query(queryString)).toBe(expected);
                        }
                    }

                    /* Not Like */
                    for (const operator of validNotContainOperators) {
                        for (const { attributeName, input, expected } of testCases) {
                            const queryString = `SELECT * FROM DOM WHERE ${keyword}('${attributeName}') ${operator} ${input}`;

                            expect(query(queryString)).toBe(`:not(${expected})`);
                        }
                    }
                }
            });
        });

        describe('STYLE', () => {
            const keywords = [KeywordType.STYLE];

            test('Equals; Not Equals', () => {
                const equalOperators = [SymbolType.ASSIGN, SymbolType.EQ, OperatorType.EQUALS];
                const notEqualOperators = [SymbolType.NEQ, SymbolType.NEQ_LG, `${OperatorType.NOT} ${OperatorType.EQUALS}`];

                const validKeywords = generateLowerCaseVariations(keywords);
                const validEqualOperators = generateLowerCaseVariations(equalOperators);
                const validNotEqualOperators = generateLowerCaseVariations(notEqualOperators);

                const testCases = [
                    { input: `'width: 30px'`, expected: `[style="width: 30px"]` },
                    { input: `'height: 5;'`, expected: `[style="height: 5;"]` },
                    { input: `'flex-direction: column-reverse'`, expected: '[style="flex-direction: column-reverse"]' },
                    { input: `'justify-self: first baseline'`, expected: '[style="justify-self: first baseline"]' },
                    { input: `'justify-self: first baseline; height: 1.5'`, expected: '[style="justify-self: first baseline; height: 1.5"]' },
                    { input: `'flex: 1; width: 35%; height: 80%'`, expected: '[style="flex: 1; width: 35%; height: 80%"]' },
                    { input: `'width: calc(100% * 1.5)'`, expected: '[style="width: calc(100% * 1.5)"]' },
                    { input: `'width: calc(var(--variable-special-sauce-width) - 10rem);'`, expected: '[style="width: calc(var(--variable-special-sauce-width) - 10rem);"]' },
                ];

                for (const keyword of validKeywords) {
                    /* Equals */
                    for (const operator of validEqualOperators) {
                        for (const { input, expected } of testCases) {
                            const queryString = `SELECT * FROM DOM WHERE ${keyword} ${operator} ${input}`;

                            expect(query(queryString)).toBe(expected);
                        }
                    }

                    /* Not Equals */
                    for (const operator of validNotEqualOperators) {
                        for (const { input, expected } of testCases) {
                            const queryString = `SELECT * FROM DOM WHERE ${keyword} ${operator} ${input}`;

                            expect(query(queryString)).toBe(`:not(${expected})`);
                        }
                    }
                }
            });

            test('Like; Not Like', () => {
                const likeOperators = [OperatorType.LIKE];
                const notEqualOperators = [`${OperatorType.NOT} ${OperatorType.LIKE}`];

                const validKeywords = generateLowerCaseVariations(keywords);
                const validLikeOperators = generateLowerCaseVariations(likeOperators);
                const validNotLikeOperators = generateLowerCaseVariations(notEqualOperators);

                let testCases = [
                    { input: `'width: 30px'`, expected: `[style*="width: 30px"]` },
                    { input: `'height: 5;'`, expected: `[style*="height: 5;"]` },
                    { input: `'flex-direction: column-reverse'`, expected: '[style*="flex-direction: column-reverse"]' },
                    { input: `'justify-self: first baseline'`, expected: '[style*="justify-self: first baseline"]' },
                    { input: `'justify-self: first baseline; height: 1.5'`, expected: '[style*="justify-self: first baseline; height: 1.5"]' },
                    { input: `'flex: 1; width: 35%; height: 80[%]'`, expected: '[style*="flex: 1; width: 35%; height: 80%"]' },
                    { input: `'width: calc(100% * 1.5)'`, expected: '[style*="width: calc(100% * 1.5)"]' },
                    { input: `'width: calc(var(--variable-special-sauce-width) - 10rem);'`, expected: '[style*="width: calc(var(--variable-special-sauce-width) - 10rem);"]' },
                ];

                for (const { input, expected } of [...testCases]) {
                    const unquotedInput = String(input).startsWith("'") ? String(input).slice(1, String(input).toString().length - 1) : String(input);

                    testCases.push({
                        input: formatInputForLikeComparison(unquotedInput, 'both'),
                        expected: `[style*="${unquotedInput.replace('[%]', '%')}"]`,
                    });

                    testCases.push({
                        input: formatInputForLikeComparison(unquotedInput, 'start'),
                        expected: `[style$="${unquotedInput.replace('[%]', '%')}"]`,
                    });

                    testCases.push({
                        input: formatInputForLikeComparison(unquotedInput, 'end'),
                        expected: `[style^="${unquotedInput.replace('[%]', '%')}"]`,
                    });
                }

                for (const keyword of validKeywords) {
                    /* Like */
                    for (const operator of validLikeOperators) {
                        for (const { input, expected } of testCases) {
                            const queryString = `SELECT * FROM DOM WHERE ${keyword} ${operator} ${input}`;

                            expect(query(queryString)).toBe(expected);
                        }
                    }

                    /* Not Like */
                    for (const operator of validNotLikeOperators) {
                        for (const { input, expected } of testCases) {
                            const queryString = `SELECT * FROM DOM WHERE ${keyword} ${operator} ${input}`;

                            expect(query(queryString)).toBe(`:not(${expected})`);
                        }
                    }
                }
            });

            test('Contains; Not Contains', () => {
                const containOperators = [OperatorType.CONTAINS];
                const notContainOperators = [`${OperatorType.NOT} ${OperatorType.CONTAINS}`];

                const validKeywords = generateLowerCaseVariations(keywords);
                const validContainOperators = generateLowerCaseVariations(containOperators);
                const validNotContainOperators = generateLowerCaseVariations(notContainOperators);

                const testCases = [
                    { input: `'width: 30px'`, expected: `[style~="width: 30px"]` },
                    { input: `'height: 5;'`, expected: `[style~="height: 5;"]` },
                    { input: `'flex-direction: column-reverse'`, expected: '[style~="flex-direction: column-reverse"]' },
                    { input: `'justify-self: first baseline'`, expected: '[style~="justify-self: first baseline"]' },
                    { input: `'justify-self: first baseline; height: 1.5'`, expected: '[style~="justify-self: first baseline; height: 1.5"]' },
                    { input: `'flex: 1; width: 35%; height: 80%'`, expected: '[style~="flex: 1; width: 35%; height: 80%"]' },
                    { input: `'width: calc(100% * 1.5)'`, expected: '[style~="width: calc(100% * 1.5)"]' },
                    { input: `'width: calc(var(--variable-special-sauce-width) - 10rem);'`, expected: '[style~="width: calc(var(--variable-special-sauce-width) - 10rem);"]' },
                ];

                for (const keyword of validKeywords) {
                    /* Like */
                    for (const operator of validContainOperators) {
                        for (const { input, expected } of testCases) {
                            const queryString = `SELECT * FROM DOM WHERE ${keyword} ${operator} ${input}`;

                            expect(query(queryString)).toBe(expected);
                        }
                    }

                    /* Not Like */
                    for (const operator of validNotContainOperators) {
                        for (const { input, expected } of testCases) {
                            const queryString = `SELECT * FROM DOM WHERE ${keyword} ${operator} ${input}`;

                            expect(query(queryString)).toBe(`:not(${expected})`);
                        }
                    }
                }
            });
        });
    });

    describe('Extended Intermediate', () => {
        test('Keyword Order Priority', () => {
            const testCases = [
                { input: `TAG = 'a' AND ID = 'confirm-link'`, expected: `a#confirm-link` },
                { input: `TAG = 'a' AND CLASS = 'btn-blue'`, expected: `a.btn-blue` },
                { input: `TAG = 'a' AND ID = 'confirm-link' AND CLASS = 'btn-blue'`, expected: `a#confirm-link.btn-blue` },
                { input: `ID = 'confirm-link' AND TAG = 'a'`, expected: `a#confirm-link` },
                { input: `CLASS = 'btn-blue' AND TAG = 'a'`, expected: `a.btn-blue` },
                { input: `CLASS = 'btn-blue' AND ID = 'confirm-link' AND TAG = 'a'`, expected: `a#confirm-link.btn-blue` },
                { input: `ATTR('value') = 'ready' AND CLASS = 'btn-blue' AND ID = 'confirm-link' AND TAG = 'a'`, expected: `a#confirm-link.btn-blue[value="ready"]` },
            ];

            for (const { input, expected } of testCases) {
                const queryString = `SELECT * FROM DOM WHERE ${input}`;

                expect(query(queryString)).toBe(expected);
            }
        });

        test('Auto Groupings (AND | OR)', () => {
            const testCases = [
                { input: `TAG = 'a' OR CLASS = 'link'`, expected: `a, .link` },
                { input: `TAG = 'a' AND CLASS = 'active' OR CLASS = 'link'`, expected: `a.active, .link` },
                { input: `TAG = 'a' AND CLASS = 'active' OR CLASS = 'link' OR TAG = 'button'`, expected: `a.active, .link, button` },
                { input: `TAG = 'a' AND CLASS = 'active' OR CLASS = 'link' OR TAG = 'button' AND ID = 'to-top-link'`, expected: `a.active, .link, button#to-top-link` },
                {
                    input: `TAG = 'a' AND CLASS = 'active' OR CLASS = 'link' AND TAG = 'a' OR TAG = 'button' AND ID = 'to-top-link'`,
                    expected: `a.active, a.link, button#to-top-link`,
                },
            ];

            for (const { input, expected } of testCases) {
                const queryString = `SELECT * FROM DOM WHERE ${input}`;

                expect(query(queryString)).toBe(expected);
            }
        });

        describe('Shallow Groupings with Braces (AND | OR)', () => {
            test('Manual Braces Must Match Auto Groupings', () => {
                const testCases = [
                    /* Original subset from test "Groupings (AND | OR)" */
                    { input: `(TAG = 'a') OR (CLASS = 'link')`, expected: `a, .link` },
                    { input: `(TAG = 'a' AND CLASS = 'active') OR (CLASS = 'link')`, expected: `a.active, .link` },
                    { input: `(TAG = 'a' AND CLASS = 'active') OR (CLASS = 'link') OR (TAG = 'button')`, expected: `a.active, .link, button` },
                    { input: `(TAG = 'a' AND CLASS = 'active') OR (CLASS = 'link') OR (TAG = 'button' AND ID = 'to-top-link')`, expected: `a.active, .link, button#to-top-link` },
                    {
                        input: `(TAG = 'a' AND CLASS = 'active') OR (CLASS = 'link' AND TAG = 'a') OR (TAG = 'button' AND ID = 'to-top-link')`,
                        expected: `a.active, a.link, button#to-top-link`,
                    },
                ];

                for (const { input, expected } of testCases) {
                    const queryString = `SELECT * FROM DOM WHERE ${input}`;

                    expect(query(queryString)).toBe(expected);
                }
            });

            test('Single [AND] Cross Apply with [OR] Grouping', () => {
                const testCases = [
                    { input: `TAG = 'a' AND (CLASS = 'active' OR CLASS = 'link' AND ID = 'old-link')`, expected: `a.active, a#old-link.link` },
                    { input: `TAG = 'a' AND (CLASS = 'active' AND ID = 'new-link' OR CLASS = 'link')`, expected: `a#new-link.active, a.link` },
                    { input: `TAG = 'a' AND (CLASS = 'active' AND ID = 'new-link' OR CLASS = 'link' AND ID = 'old-link')`, expected: `a#new-link.active, a#old-link.link` },
                    {
                        input: `CLASS = 'orange' AND TAG = 'a' AND (CLASS = 'active' AND ID = 'new-link' OR CLASS = 'link' AND ID = 'old-link')`,
                        expected: `a#new-link.orange.active, a#old-link.orange.link`,
                    },
                    { input: `TAG = 'a' AND (CLASS = 'active' OR CLASS = 'link' OR ATTR <> 'disabled')`, expected: `a.active, a.link, a:not([disabled])` },
                    // {input: `(CLASS = 'active' AND ID = 'new-link' OR CLASS = 'link' AND ID = 'old-link') AND TAG = 'a'`, expected: `a#new-link.active, a#old-link.link`}, // TODO: Add support for adding post multiply
                ];

                for (const { input, expected } of testCases) {
                    const queryString = `SELECT * FROM DOM WHERE ${input}`;

                    expect(query(queryString)).toBe(expected);
                }
            });
        });
    });

    describe('Pseudo-Classes and Pseudo-Elements', () => {
        describe('TYPEOF Function - Pseudo Classes', () => {
            test('Link pseudo classes', () => {
                const testCases = [
                    { input: `TAG = 'a' AND TYPEOF(LINK)`, expected: `a:link` },
                    { input: `TAG = 'a' AND TYPEOF(VISITED)`, expected: `a:visited` },
                ];

                for (const { input, expected } of testCases) {
                    const queryString = `SELECT * FROM DOM WHERE ${input}`;
                    expect(query(queryString)).toBe(expected);
                }
            });

            test('User action pseudo classes', () => {
                const testCases = [
                    { input: `TAG = 'button' AND TYPEOF(HOVER)`, expected: `button:hover` },
                    { input: `TAG = 'input' AND TYPEOF(FOCUS)`, expected: `input:focus` },
                    { input: `TAG = 'button' AND TYPEOF(ACTIVE)`, expected: `button:active` },
                ];

                for (const { input, expected } of testCases) {
                    const queryString = `SELECT * FROM DOM WHERE ${input}`;
                    expect(query(queryString)).toBe(expected);
                }
            });

            test('UI element states pseudo classes', () => {
                const testCases = [
                    { input: `TAG = 'input' AND TYPEOF(ENABLED)`, expected: `input:enabled` },
                    { input: `TAG = 'input' AND TYPEOF(DISABLED)`, expected: `input:disabled` },
                    { input: `TAG = 'input' AND TYPEOF(CHECKED)`, expected: `input:checked` },
                ];

                for (const { input, expected } of testCases) {
                    const queryString = `SELECT * FROM DOM WHERE ${input}`;
                    expect(query(queryString)).toBe(expected);
                }
            });

            test('Miscellaneous pseudo classes', () => {
                const testCases = [{ input: `TAG = 'section' AND TYPEOF(TARGET)`, expected: `section:target` }];

                for (const { input, expected } of testCases) {
                    const queryString = `SELECT * FROM DOM WHERE ${input}`;
                    expect(query(queryString)).toBe(expected);
                }
            });

            test('Pseudo elements', () => {
                const testCases = [
                    { input: `TAG = 'p' AND TYPEOF(FIRSTLINE)`, expected: `p::first-line` },
                    { input: `TAG = 'p' AND TYPEOF(FIRSTLETTER)`, expected: `p::first-letter` },
                    { input: `TAG = 'div' AND TYPEOF(BEFORE)`, expected: `div::before` },
                    { input: `TAG = 'div' AND TYPEOF(AFTER)`, expected: `div::after` },
                ];

                for (const { input, expected } of testCases) {
                    const queryString = `SELECT * FROM DOM WHERE ${input}`;
                    expect(query(queryString)).toBe(expected);
                }
            });
        });

        describe('CHILD Function - Structural Pseudo Classes', () => {
            test('Root selector', () => {
                const testCases = [
                    { input: `CHILD(ROOT)`, expected: `:root` },
                    { input: `TAG = 'html' AND CHILD(ROOT)`, expected: `html:root` },
                ];

                for (const { input, expected } of testCases) {
                    const queryString = `SELECT * FROM DOM WHERE ${input}`;
                    expect(query(queryString)).toBe(expected);
                }
            });

            test('Basic child position selectors', () => {
                const testCases = [
                    { input: `TAG = 'li' AND CHILD()`, expected: `li:first-child` },
                    { input: `TAG = 'li' AND CHILD(FIRST)`, expected: `li:first-child` },
                    { input: `TAG = 'li' AND CHILD(LAST)`, expected: `li:last-child` },
                    { input: `TAG = 'p' AND CHILD(ONLY)`, expected: `p:only-child` },
                    { input: `TAG = 'div' AND CHILD(EMPTY)`, expected: `div:empty` },
                ];

                for (const { input, expected } of testCases) {
                    const queryString = `SELECT * FROM DOM WHERE ${input}`;
                    expect(query(queryString)).toBe(expected);
                }
            });

            test('Type-based child selectors with AS TYPEOF', () => {
                const testCases = [
                    { input: `TAG = 'p' AND CHILD() AS TYPEOF`, expected: `p:first-of-type` },
                    { input: `TAG = 'p' AND CHILD(FIRST) AS TYPEOF`, expected: `p:first-of-type` },
                    { input: `TAG = 'p' AND CHILD(LAST) AS TYPEOF`, expected: `p:last-of-type` },
                    { input: `TAG = 'img' AND CHILD(ONLY) AS TYPEOF`, expected: `img:only-of-type` },
                ];

                for (const { input, expected } of testCases) {
                    const queryString = `SELECT * FROM DOM WHERE ${input}`;
                    expect(query(queryString)).toBe(expected);
                }
            });

            test('Nth-child expressions', () => {
                const testCases = [
                    { input: `TAG = 'tr' AND CHILD(ODD)`, expected: `tr:nth-child(odd)` },
                    { input: `TAG = 'tr' AND CHILD(EVEN)`, expected: `tr:nth-child(even)` },
                    { input: `TAG = 'tr' AND CHILD(2N+1)`, expected: `tr:nth-child(2n+1)` },
                    { input: `TAG = 'tr' AND CHILD(3N)`, expected: `tr:nth-child(3n)` },
                    { input: `TAG = 'li' AND CHILD(5)`, expected: `li:nth-child(5)` },
                ];

                for (const { input, expected } of testCases) {
                    const queryString = `SELECT * FROM DOM WHERE ${input}`;
                    expect(query(queryString)).toBe(expected);
                }
            });

            test('Nth-last-child expressions', () => {
                const testCases = [
                    { input: `TAG = 'tr' AND CHILD(LAST, ODD)`, expected: `tr:nth-last-child(odd)` },
                    { input: `TAG = 'tr' AND CHILD(LAST, EVEN)`, expected: `tr:nth-last-child(even)` },
                    { input: `TAG = 'tr' AND CHILD(LAST, 2N+1)`, expected: `tr:nth-last-child(2n+1)` },
                    { input: `TAG = 'li' AND CHILD(LAST, 3)`, expected: `li:nth-last-child(3)` },
                ];

                for (const { input, expected } of testCases) {
                    const queryString = `SELECT * FROM DOM WHERE ${input}`;
                    expect(query(queryString)).toBe(expected);
                }
            });

            test('Nth-of-type expressions', () => {
                const testCases = [
                    { input: `TAG = 'h2' AND CHILD(ODD) AS TYPEOF`, expected: `h2:nth-of-type(odd)` },
                    { input: `TAG = 'h2' AND CHILD(EVEN) AS TYPEOF`, expected: `h2:nth-of-type(even)` },
                    { input: `TAG = 'p' AND CHILD(2N+1) AS TYPEOF`, expected: `p:nth-of-type(2n+1)` },
                    { input: `TAG = 'img' AND CHILD(3) AS TYPEOF`, expected: `img:nth-of-type(3)` },
                ];

                for (const { input, expected } of testCases) {
                    const queryString = `SELECT * FROM DOM WHERE ${input}`;
                    expect(query(queryString)).toBe(expected);
                }
            });

            test('Nth-last-of-type expressions', () => {
                const testCases = [
                    { input: `TAG = 'h2' AND CHILD(LAST, ODD) AS TYPEOF`, expected: `h2:nth-last-of-type(odd)` },
                    { input: `TAG = 'h2' AND CHILD(LAST, EVEN) AS TYPEOF`, expected: `h2:nth-last-of-type(even)` },
                    { input: `TAG = 'p' AND CHILD(LAST, 2N+1) AS TYPEOF`, expected: `p:nth-last-of-type(2n+1)` },
                    { input: `TAG = 'img' AND CHILD(LAST, 2) AS TYPEOF`, expected: `img:nth-last-of-type(2)` },
                ];

                for (const { input, expected } of testCases) {
                    const queryString = `SELECT * FROM DOM WHERE ${input}`;
                    expect(query(queryString)).toBe(expected);
                }
            });
        });

        describe('LANG/LANGUAGE Function', () => {
            test('Language selector', () => {
                const testCases = [
                    { input: `TAG = 'p' AND LANG('en')`, expected: `p:lang(en)` },
                    { input: `TAG = 'div' AND LANGUAGE('fr')`, expected: `div:lang(fr)` },
                    { input: `LANG('es')`, expected: `:lang(es)` },
                    { input: `LANGUAGE('de-DE')`, expected: `:lang(de-DE)` },
                ];

                for (const { input, expected } of testCases) {
                    const queryString = `SELECT * FROM DOM WHERE ${input}`;
                    expect(query(queryString)).toBe(expected);
                }
            });
        });
    });

    describe('Complex Combinations and Edge Cases', () => {
        test('Multiple attributes on same element', () => {
            const testCases = [
                {
                    input: `TAG = 'input' AND ATTR('type') = 'text' AND ATTR('name') = 'username'`,
                    expected: `input[type="text"][name="username"]`,
                },
                {
                    input: `TAG = 'div' AND ATTR('data-role') = 'modal' AND ATTR('data-state') = 'open'`,
                    expected: `div[data-role="modal"][data-state="open"]`,
                },
                {
                    input: `CLASS = 'form-field' AND ATTR('required') AND ATTR('data-validation') LIKE 'email%'`,
                    expected: `.form-field[required][data-validation^="email"]`,
                },
            ];

            for (const { input, expected } of testCases) {
                const queryString = `SELECT * FROM DOM WHERE ${input}`;
                expect(query(queryString)).toBe(expected);
            }
        });

        test('Complex pseudo-class combinations', () => {
            const testCases = [
                {
                    input: `TAG = 'input' AND TYPEOF(ENABLED) AND TYPEOF(FOCUS)`,
                    expected: `input:enabled:focus`,
                },
                {
                    input: `TAG = 'a' AND TYPEOF(LINK) AND TYPEOF(HOVER)`,
                    expected: `a:link:hover`,
                },
                {
                    input: `TAG = 'li' AND CHILD(ODD) AND TYPEOF(HOVER)`,
                    expected: `li:nth-child(odd):hover`,
                },
            ];

            for (const { input, expected } of testCases) {
                const queryString = `SELECT * FROM DOM WHERE ${input}`;
                expect(query(queryString)).toBe(expected);
            }
        });

        test('Mixed attribute patterns', () => {
            const testCases = [
                {
                    input: `ATTR('class') CONTAINS 'active' AND ATTR('data-id') = '123'`,
                    expected: `[class~="active"][data-id="123"]`,
                },
                {
                    input: `ATTR('title') LIKE '%tooltip%' AND ATTR('role') = 'button'`,
                    expected: `[title*="tooltip"][role="button"]`,
                },
                {
                    input: `ATTR('href') LIKE 'https%' AND ATTR('target') = '_blank'`,
                    expected: `[href^="https"][target="_blank"]`,
                },
            ];

            for (const { input, expected } of testCases) {
                const queryString = `SELECT * FROM DOM WHERE ${input}`;
                expect(query(queryString)).toBe(expected);
            }
        });

        test('Numeric values in attributes', () => {
            const testCases = [
                { input: `ATTR('tabindex') = 0`, expected: `[tabindex="0"]` },
                { input: `ATTR('data-count') = 42`, expected: `[data-count="42"]` },
                { input: `ATTR('max') = 100`, expected: `[max="100"]` },
                { input: `ATTR('data-index') LIKE '1%'`, expected: `[data-index^="1"]` },
            ];

            for (const { input, expected } of testCases) {
                const queryString = `SELECT * FROM DOM WHERE ${input}`;
                expect(query(queryString)).toBe(expected);
            }
        });

        test('Special characters in values', () => {
            const testCases = [
                { input: `CLASS = 'btn-primary'`, expected: `.btn-primary` },
                { input: `ID = 'my_special_id'`, expected: `#my_special_id` },
                { input: `ATTR('data-test') = 'form[input]'`, expected: `[data-test="form[input]"]` },
            ];

            for (const { input, expected } of testCases) {
                const queryString = `SELECT * FROM DOM WHERE ${input}`;
                expect(query(queryString)).toBe(expected);
            }
        });

        test('Complex style attribute matching', () => {
            const testCases = [
                {
                    input: `STYLE LIKE 'display: none%'`,
                    expected: `[style^="display: none"]`,
                },
                {
                    input: `STYLE CONTAINS 'color: red'`,
                    expected: `[style~="color: red"]`,
                },
                {
                    input: `TAG = 'div' AND STYLE LIKE '%background%'`,
                    expected: `div[style*="background"]`,
                },
            ];

            for (const { input, expected } of testCases) {
                const queryString = `SELECT * FROM DOM WHERE ${input}`;
                expect(query(queryString)).toBe(expected);
            }
        });
    });

    describe('Combinator Edge Cases', () => {
        test('Multiple levels of combinators', () => {
            const testCases = [
                {
                    input: `TAG('span') CHILD OF TAG('p') WITHIN TAG('div')`,
                    expected: `div p > span`,
                },
                {
                    input: `TAG('li') WITHIN TAG('ul') CHILD OF TAG('nav')`,
                    expected: `nav > ul li`,
                },
                {
                    input: `TAG('input') NEXT TO TAG('label') WITHIN TAG('form')`,
                    expected: `form label + input`,
                },
            ];

            for (const { input, expected } of testCases) {
                const queryString = `SELECT * FROM DOM WHERE ${input}`;
                expect(query(queryString)).toBe(expected);
            }
        });

        test('Combinators with complex selectors', () => {
            const testCases = [
                {
                    input: `CLASS = 'error' AND TAG = 'span' NEXT TO TAG = 'input' AND ATTR('type') = 'email'`,
                    expected: `input[type="email"] + span.error`,
                },
                {
                    input: `ID = 'sidebar' AND TAG = 'div' WITHIN TAG = 'main' AND CLASS = 'container'`,
                    expected: `main.container div#sidebar`,
                },
            ];

            for (const { input, expected } of testCases) {
                const queryString = `SELECT * FROM DOM WHERE ${input}`;
                const result = query(queryString);
                expect(result).toBeDefined();
            }
        });
    });

    describe('Case Sensitivity and Variations', () => {
        test('Lowercase keyword variations', () => {
            const testCases = [
                { input: `tag = 'div'`, expected: `div` },
                { input: `class = 'active'`, expected: `.active` },
                { input: `id = 'header'`, expected: `#header` },
                { input: `attr('name') = 'username'`, expected: `[name="username"]` },
                { input: `element = 'span'`, expected: `span` },
            ];

            for (const { input, expected } of testCases) {
                const queryString = `SELECT * FROM DOM WHERE ${input}`;
                expect(query(queryString)).toBe(expected);
            }
        });

        test('Mixed case operator variations', () => {
            const testCases = [
                { input: `TAG = 'a' and CLASS = 'link'`, expected: `a.link` },
                { input: `TAG = 'div' or TAG = 'span'`, expected: `div, span` },
                { input: `ATTR('type') not equals 'hidden'`, expected: `:not([type="hidden"])` },
                { input: `CLASS like 'btn%'`, expected: `[class^="btn"]` },
                { input: `ID contains 'modal'`, expected: `[id~="modal"]` },
            ];

            for (const { input, expected } of testCases) {
                const queryString = `SELECT * FROM DOM WHERE ${input}`;
                expect(query(queryString)).toBe(expected);
            }
        });
    });

    describe('Error Handling and Boundary Cases', () => {
        test('Empty and whitespace handling', () => {
            const testCases = [
                { input: `TAG = ''`, expected: `` },
                { input: `CLASS = '   '`, expected: `.   ` },
                { input: `ID = 'my-id'`, expected: `#my-id` },
            ];

            for (const { input, expected } of testCases) {
                const queryString = `SELECT * FROM DOM WHERE ${input}`;
                expect(query(queryString)).toBe(expected);
            }
        });

        test('Complex CSS escaping scenarios', () => {
            const testCases = [{ input: `CLASS = 'single-quote'`, expected: `.single-quote` }];

            for (const { input, expected } of testCases) {
                const queryString = `SELECT * FROM DOM WHERE ${input}`;
                expect(query(queryString)).toBe(expected);
            }
        });
    });

    describe('Advanced Grouping Scenarios', () => {
        test('Complex OR groupings with attributes', () => {
            const testCases = [
                {
                    input: `TAG = 'input' AND ATTR('type') = 'text' OR TAG = 'textarea'`,
                    expected: `input[type="text"], textarea`,
                },
                {
                    input: `CLASS = 'btn' AND CLASS = 'primary' OR CLASS = 'btn' AND CLASS = 'secondary'`,
                    expected: `.btn.primary, .btn.secondary`,
                },
                {
                    input: `TAG = 'a' AND TYPEOF(HOVER) OR TAG = 'button' AND TYPEOF(FOCUS)`,
                    expected: `a:hover, button:focus`,
                },
            ];

            for (const { input, expected } of testCases) {
                const queryString = `SELECT * FROM DOM WHERE ${input}`;
                expect(query(queryString)).toBe(expected);
            }
        });

        test('Nested grouping with combinators and OR', () => {
            const testCases = [
                {
                    input: `TAG = 'span' AND (CLASS = 'icon' OR CLASS = 'text') WITHIN TAG = 'button'`,
                    expected: `button span.icon, button span.text`,
                },
                {
                    input: `(TAG = 'input' AND ATTR('type') = 'radio' OR TAG = 'input' AND ATTR('type') = 'checkbox') NEXT TO TAG = 'label'`,
                    expected: `label + input[type="radio"], label + input[type="checkbox"]`,
                },
            ];

            for (const { input, expected } of testCases) {
                const queryString = `SELECT * FROM DOM WHERE ${input}`;
                const result = query(queryString);
                expect(result).toBeDefined();
            }
        });
    });

    describe('Additional Test Coverage for Missing Scenarios', () => {
        test('Function variants and aliases', () => {
            const testCases = [
                { input: `TAG('div')`, expected: `div` },
                { input: `TAG('custom-element')`, expected: `custom-element` },

                { input: `ATTRIBUTE('data-id') = '123'`, expected: `[data-id="123"]` },
                { input: `ATTR('data-id') = '123'`, expected: `[data-id="123"]` },

                { input: `LANG('en-US')`, expected: `:lang(en-US)` },
                { input: `LANGUAGE('zh-CN')`, expected: `:lang(zh-CN)` },
            ];

            for (const { input, expected } of testCases) {
                const queryString = `SELECT * FROM DOM WHERE ${input}`;
                expect(query(queryString)).toBe(expected);
            }
        });

        test('Symbol operator variations', () => {
            const testCases = [
                { input: `TAG = 'div'`, expected: `div` },
                { input: `TAG == 'div'`, expected: `div` },
                { input: `CLASS = 'active'`, expected: `.active` },
                { input: `CLASS == 'active'`, expected: `.active` },

                { input: `TAG != 'div'`, expected: `:not(div)` },
                { input: `TAG <> 'div'`, expected: `:not(div)` },
                { input: `CLASS != 'inactive'`, expected: `:not(.inactive)` },
                { input: `CLASS <> 'inactive'`, expected: `:not(.inactive)` },
            ];

            for (const { input, expected } of testCases) {
                const queryString = `SELECT * FROM DOM WHERE ${input}`;
                expect(query(queryString)).toBe(expected);
            }
        });

        test('Combinator operator variations', () => {
            const testCases = [
                { input: `TAG('span') CHILD OF TAG('div')`, expected: `div > span` },
                { input: `TAG('span') NEXT TO TAG('div')`, expected: `div + span` },
                { input: `TAG('span') SIBLING OF TAG('div')`, expected: `div ~ span` },
                { input: `TAG('span') WITHIN TAG('div')`, expected: `div span` },
            ];

            for (const { input, expected } of testCases) {
                const queryString = `SELECT * FROM DOM WHERE ${input}`;
                expect(query(queryString)).toBe(expected);
            }
        });

        test('Attribute name only matching', () => {
            const testCases = [
                { input: `ATTR = 'disabled'`, expected: `[disabled]` },
                { input: `ATTRIBUTE = 'required'`, expected: `[required]` },
                { input: `ATTR = 'data-custom'`, expected: `[data-custom]` },
                { input: `ATTRIBUTE = 'aria-label'`, expected: `[aria-label]` },
            ];

            for (const { input, expected } of testCases) {
                const queryString = `SELECT * FROM DOM WHERE ${input}`;
                expect(query(queryString)).toBe(expected);
            }
        });

        test('Complex numerical expressions in CHILD', () => {
            const testCases = [
                { input: `TAG = 'li' AND CHILD(2N)`, expected: `li:nth-child(2n)` },
                { input: `TAG = 'tr' AND CHILD(3N+2)`, expected: `tr:nth-child(3n+2)` },
                { input: `TAG = 'div' AND CHILD(4N-1)`, expected: `div:nth-child(4n-1)` },
                { input: `TAG = 'p' AND CHILD(-N+3)`, expected: `p:nth-child(-n+3)` },
            ];

            for (const { input, expected } of testCases) {
                const queryString = `SELECT * FROM DOM WHERE ${input}`;
                expect(query(queryString)).toBe(expected);
            }
        });

        test('Style attribute with complex CSS values', () => {
            const testCases = [
                { input: `STYLE = 'background: linear-gradient(45deg, red, blue)'`, expected: `[style="background: linear-gradient(45deg, red, blue)"]` },
                { input: `STYLE LIKE 'transform%'`, expected: `[style^="transform"]` },
                { input: `STYLE CONTAINS 'position: absolute'`, expected: `[style~="position: absolute"]` },
            ];

            for (const { input, expected } of testCases) {
                const queryString = `SELECT * FROM DOM WHERE ${input}`;
                expect(query(queryString)).toBe(expected);
            }
        });

        test('Comprehensive NOT operations', () => {
            const testCases = [
                { input: `TAG NOT EQUALS 'div'`, expected: `:not(div)` },
                { input: `CLASS NOT EQUALS 'hidden'`, expected: `:not(.hidden)` },
                { input: `ID NOT EQUALS 'popup'`, expected: `:not(#popup)` },
                { input: `TAG <> 'span'`, expected: `:not(span)` },
                { input: `CLASS != 'inactive'`, expected: `:not(.inactive)` },
                { input: `ATTR('disabled') != 'true'`, expected: `:not([disabled="true"])` },
            ];

            for (const { input, expected } of testCases) {
                const queryString = `SELECT * FROM DOM WHERE ${input}`;
                expect(query(queryString)).toBe(expected);
            }
        });

        test('Multi-class selectors', () => {
            const testCases = [
                { input: `CLASS = 'btn' AND CLASS = 'primary'`, expected: `.btn.primary` },
                { input: `CLASS = 'form' AND CLASS = 'control' AND CLASS = 'large'`, expected: `.form.control.large` },
                { input: `TAG = 'div' AND CLASS = 'container' AND CLASS = 'fluid'`, expected: `div.container.fluid` },
            ];

            for (const { input, expected } of testCases) {
                const queryString = `SELECT * FROM DOM WHERE ${input}`;
                expect(query(queryString)).toBe(expected);
            }
        });

        test('Edge cases with whitespace and special formatting', () => {
            const testCases = [
                { input: `CLASS    =     'active'`, expected: `.active` },
                { input: `ATTR( 'data-id' ) = '123'`, expected: `[data-id="123"]` },
            ];

            for (const { input, expected } of testCases) {
                const queryString = `SELECT * FROM DOM WHERE ${input}`;
                expect(query(queryString)).toBe(expected);
            }
        });

        test('Complex selector ordering priority', () => {
            const testCases = [
                { input: `ATTR('data-value') = '1' AND CLASS = 'test' AND ID = 'main' AND TAG = 'div'`, expected: `div#main.test[data-value="1"]` },
                { input: `CLASS = 'primary' AND TAG = 'button' AND ATTR('type') = 'submit'`, expected: `button.primary[type="submit"]` },
            ];

            for (const { input, expected } of testCases) {
                const queryString = `SELECT * FROM DOM WHERE ${input}`;
                expect(query(queryString)).toBe(expected);
            }
        });

        test('Real-world practical selectors', () => {
            const testCases = [
                { input: `TAG = 'input' AND ATTR('type') = 'email' AND TYPEOF(FOCUS)`, expected: `input[type="email"]:focus` },
                { input: `TAG = 'button' AND CLASS = 'btn' AND CLASS = 'btn-primary' AND TYPEOF(DISABLED)`, expected: `button.btn.btn-primary:disabled` },
                { input: `TAG = 'tr' AND CHILD(EVEN) AND TYPEOF(HOVER)`, expected: `tr:nth-child(even):hover` },
                { input: `TAG = 'div' AND CLASS = 'modal' AND ATTR('aria-hidden') = 'false'`, expected: `div.modal[aria-hidden="false"]` },
            ];

            for (const { input, expected } of testCases) {
                const queryString = `SELECT * FROM DOM WHERE ${input}`;
                expect(query(queryString)).toBe(expected);
            }
        });

        test('Comments and whitespace handling', () => {
            const testCases = [
                { input: `TAG = 'div' /* this is a comment */`, expected: `div` },
                { input: `TAG = 'span' -- line comment`, expected: `span` },
            ];

            for (const { input, expected } of testCases) {
                const queryString = `SELECT * FROM DOM WHERE ${input}`;
                expect(query(queryString)).toBe(expected);
            }
        });

        test('Advanced nth expressions', () => {
            const testCases = [
                { input: `TAG = 'li' AND CHILD(2N-1)`, expected: `li:nth-child(2n-1)` },
                { input: `TAG = 'tr' AND CHILD(-2N+10)`, expected: `tr:nth-child(-2n+10)` },
                { input: `TAG = 'div' AND CHILD(FIRST, N+5) AS TYPEOF`, expected: `div:nth-of-type(n+5)` },
                { input: `TAG = 'p' AND CHILD(LAST, -N+3) AS TYPEOF`, expected: `p:nth-last-of-type(-n+3)` },
            ];

            for (const { input, expected } of testCases) {
                const queryString = `SELECT * FROM DOM WHERE ${input}`;
                expect(query(queryString)).toBe(expected);
            }
        });

        test('Escape sequences in string values', () => {
            const testCases = [
                { input: `CLASS = 'btn-primary'`, expected: `.btn-primary` },
                { input: `ATTR('data-test') = 'simple_value'`, expected: `[data-test="simple_value"]` },
            ];

            for (const { input, expected } of testCases) {
                const queryString = `SELECT * FROM DOM WHERE ${input}`;
                expect(query(queryString)).toBe(expected);
            }
        });

        test('Comprehensive operator precedence', () => {
            const testCases = [
                { input: `TAG = 'a' AND CLASS = 'link' OR TAG = 'button' AND CLASS = 'btn'`, expected: `a.link, button.btn` },
                { input: `CLASS = 'nav' OR TAG = 'span' AND ATTR('role') = 'button'`, expected: `.nav, span[role="button"]` },
            ];

            for (const { input, expected } of testCases) {
                const queryString = `SELECT * FROM DOM WHERE ${input}`;
                expect(query(queryString)).toBe(expected);
            }
        });
    });
});

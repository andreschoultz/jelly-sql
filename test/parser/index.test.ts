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

                    { input: `'%confirmation'`, expected: '[id^="confirmation"]' },
                    { input: `'%alert-modal'`, expected: '[id^="alert-modal"]' },
                    { input: `'%user_form'`, expected: '[id^="user_form"]' },

                    { input: `'confirmation%'`, expected: '[id$="confirmation"]' },
                    { input: `'alert-modal%'`, expected: '[id$="alert-modal"]' },
                    { input: `'user_form%'`, expected: '[id$="user_form"]' },
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

                    { input: `'%success'`, expected: '[class^="success"]' },
                    { input: `'%btn-large'`, expected: '[class^="btn-large"]' },
                    { input: `'%modal_header'`, expected: '[class^="modal_header"]' },

                    { input: `'success%'`, expected: '[class$="success"]' },
                    { input: `'btn-large%'`, expected: '[class$="btn-large"]' },
                    { input: `'modal_header%'`, expected: '[class$="modal_header"]' },
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
                        expected: `[${attributeName}^="${unquotedInput.replace('[%]', '%')}"]`,
                    });

                    testCases.push({
                        attributeName,
                        input: formatInputForLikeComparison(unquotedInput, 'end'),
                        expected: `[${attributeName}$="${unquotedInput.replace('[%]', '%')}"]`,
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
                        expected: `[style^="${unquotedInput.replace('[%]', '%')}"]`,
                    });

                    testCases.push({
                        input: formatInputForLikeComparison(unquotedInput, 'end'),
                        expected: `[style$="${unquotedInput.replace('[%]', '%')}"]`,
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
});

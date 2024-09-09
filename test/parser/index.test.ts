import { describe, expect, test } from 'vitest';

import { query } from '../../src/index';
import { KeywordType, OperatorType, SymbolType } from '../../src/lexer/types';

describe('QuerySelector Generator', () => {
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

            test('Valid - Equals; Not Equals', () => {
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
        });

        describe('ID', () => {
            const keywords = [KeywordType.ID];

            test('Valid - Equals; Not Equals', () => {
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

            test('Valid - Like; Not Like', () => {
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

            test('Valid - Contains; Not Contains', () => {
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

            test('Valid - Equals; Not Equals', () => {
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

            test('Valid - Like; Not Like', () => {
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

            test('Valid - Contains; Not Contains', () => {
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

        describe('ATTRIBUTE', () => {
            const keywords = [KeywordType.ATTRIBUTE];

            test('Valid - Name match', () => {
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

            test('Valid - Equals; Not Equals', () => {
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

            test('Valid - Like; Not Like', () => {
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

            test('Valid - Contains; Not Contains', () => {
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

            test('Valid - Equals; Not Equals', () => {
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

            test('Valid - Like; Not Like', () => {
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

            test('Valid - Contains; Not Contains', () => {
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
});

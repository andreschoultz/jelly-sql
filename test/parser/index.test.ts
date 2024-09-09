import { describe, expect, test } from 'vitest';

import { query } from '../../src/index';
import { KeywordType, OperatorType, SymbolType } from '../../src/lexer/types';

describe('QuerySelector Generator', () => {
    describe('Isolated Basic', () => {
        describe('TAG | ELEMENT', () => {
            const keywords = [KeywordType.TAG, KeywordType.ELEMENT];
            const generateLowerCaseVariations = (arr: string[]) => [...arr, ...arr.map(x => x.toLowerCase())];

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
            const generateLowerCaseVariations = (arr: string[]) => [...arr, ...arr.map(x => x.toLowerCase())];

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
            const generateLowerCaseVariations = (arr: string[]) => [...arr, ...arr.map(x => x.toLowerCase())];

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
    });
});

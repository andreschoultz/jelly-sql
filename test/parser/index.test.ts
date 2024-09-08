import { describe, expect, test } from 'vitest';

import { query } from '../../src/index';
import { KeywordType, OperatorType, SymbolType } from '../../src/lexer/types';

describe('QuerySelector Generator', () => {
    describe('Isolated Basic', () => {
        describe('TAG | ELEMENT', () => {
            test('Valid - Equals', () => {
                const keywords = [KeywordType.TAG, KeywordType.ELEMENT];
                const operators = [SymbolType.ASSIGN, SymbolType.EQ, OperatorType.EQUALS];

                const generateVariations = (arr: string[]) => [...arr, ...arr.map(x => x.toLowerCase())]; // Generate lowercase variation

                const validKeywords = generateVariations(keywords);
                const validOperators = generateVariations(operators);

                const testCases = [
                    { input: `'a'`, expected: 'a' },
                    { input: `'custom-html-tag'`, expected: 'custom-html-tag' },
                ];

                for (const keyword of validKeywords) {
                    for (const operator of validOperators) {
                        for (const { input, expected } of testCases) {
                            const queryString = `SELECT * FROM DOM WHERE ${keyword} ${operator} ${input}`;

                            expect(query(queryString)).toBe(expected);
                        }
                    }
                }
            });
        });
    });
});

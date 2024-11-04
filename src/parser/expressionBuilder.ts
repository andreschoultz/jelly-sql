import { KeywordType, OperatorType, SymbolType, Token, TokenType } from '@/lexer/types';

import { CompoundExpression, Expression, JoiningOperatorType, QueryToken } from './types';
import { isCombinatorOperator, isOrSubstitute } from './utilities';

let _tokens: Token[] = [];

/**
 * Parses an array of tokens and constructs an array of query tokens.
 *
 * This function processes a list of tokens to build expressions and compound
 * expressions based on logical operators and symbols (e.g., parentheses).
 * It identifies sections of the token list that represent WHERE clauses and
 * organizes the tokens into structured query tokens.
 *
 * Notes:
 * - Combinator operators can bee seen as a substitute for the `OR` operator. Both are used to join/group expressions.
 *      - However, later in the selector grouping/builder logic, combinators are treated as `AND` operators. This is due to the fact that only the `OR` operator is used to separate CSS selectors into groupings.
 *
 * @param tokens - The array of tokens to be processed.
 * @returns An array of query tokens representing the parsed expressions.
 */
function buildExpressions(tokens: Token[]): QueryToken[] {
    _tokens = [...tokens];

    let cutIdx = _tokens.findIndex(x => x.Type === TokenType.KEYWORD && x.Value === KeywordType.WHERE);

    if (cutIdx + 1 > _tokens.length) return [];

    _tokens = _tokens.slice(cutIdx + 1);

    let hasFirstQueryBeenConsumed = false;
    let isArtificialCompound = false;
    let compoundExpression: CompoundExpression | null = null;
    let expression: Expression | null = null;
    let queryTokens: QueryToken[] = [];

    while (_tokens.length > 0) {
        let operator: Token | null = null;
        const currentQueryTokenCount = queryTokens.length;

        if (hasFirstQueryBeenConsumed) {
            let _token = _tokens.shift();

            if (_token) {
                /**
                 * Remove leading operator. It's not needed, but makes writing convention easier to understand
                 *
                 * Ex. `SELECT * ... WITHIN TAG('a') AND WITHIN TAG('div')`
                 *
                 * VS
                 *
                 * `SELECT * ... WITHIN TAG('a') WITHIN TAG('div')`
                 */
                if (_tokens.length > 0 && isCombinatorOperator(_tokens[0].Value) && (_token.Value == OperatorType.AND || _token.Value == OperatorType.OR)) {
                    _token = _tokens.shift() ?? _token;
                }

                operator = _token;
            }
        } else {
            operator = { Type: TokenType.OPERATOR, Value: OperatorType.AND };

            /* Artificial Braces/Compound - Always start off with a compound */
            if (_tokens[0].Value !== SymbolType.LPAREN) {
                _tokens.unshift({
                    Type: TokenType.SYMBOL,
                    Value: SymbolType.LPAREN,
                });
                isArtificialCompound = true;
            }

            hasFirstQueryBeenConsumed = true;
        }

        while (queryTokens.length == currentQueryTokenCount && _tokens.length > 0) {
            let token = _tokens.shift();

            if (!token) continue;

            /**
             * Remove leading operator. It's not needed, but makes writing convention easier to understand
             *
             * Ex. `SELECT * ... WITHIN TAG('a') AND WITHIN TAG('div')`
             *
             * VS
             *
             * `SELECT * ... WITHIN TAG('a') WITHIN TAG('div')`
             */
            if (_tokens.length > 0 && isCombinatorOperator(_tokens[0].Value) && (token.Value == OperatorType.AND || token.Value == OperatorType.OR)) {
                token = _tokens.shift();

                if (!token) continue;
            }

            if (token.Type === TokenType.SYMBOL) {
                if (token.Value == SymbolType.LPAREN && compoundExpression == null) {
                    compoundExpression = {
                        Expressions: [],
                        JoiningOperator: (operator?.Value as JoiningOperatorType) ?? OperatorType.AND,
                    };
                } else if (token.Value === SymbolType.RPAREN && compoundExpression) {
                    if (expression) {
                        compoundExpression.Expressions.push(expression);
                        expression = null;
                    }

                    queryTokens.push({
                        Expressions: compoundExpression.Expressions,
                        JoiningOperator: compoundExpression.JoiningOperator,
                    });

                    compoundExpression = null;

                    /* Artificial Braces/Compound - Add brace for next compound */
                    if (_tokens.length > 0 && _tokens[1].Value !== SymbolType.LPAREN) {
                        _tokens.splice(1, 0, { Type: TokenType.SYMBOL, Value: SymbolType.LPAREN });
                        isArtificialCompound = true;
                    }
                }
            } else if (token?.Value == OperatorType.AND || isOrSubstitute(token)) {
                if (expression) {
                    if (compoundExpression) {
                        /* Artificial Braces/Compound - Close off the compound */
                        if (isArtificialCompound && (isOrSubstitute(token) || _tokens[0].Value == SymbolType.LPAREN)) {
                            if (isOrSubstitute(token)) {
                                if (_tokens[0].Value != SymbolType.LPAREN) {
                                    // Artificially add brace for next compound query
                                    _tokens.unshift({
                                        Type: TokenType.SYMBOL,
                                        Value: SymbolType.LPAREN,
                                    });
                                } else {
                                    isArtificialCompound = false;
                                }
                            } else {
                                isArtificialCompound = false;
                            }

                            _tokens.unshift(token);

                            _tokens.unshift({
                                Type: TokenType.SYMBOL,
                                Value: SymbolType.RPAREN,
                            });
                        } else {
                            if (compoundExpression.Expressions.length === 0) {
                                expression.JoiningOperator = OperatorType.AND; // Force it, otherwise it can be the the operator before the braces, which can be a 'OR'
                            }

                            compoundExpression.Expressions.push(expression);
                            expression = new Expression([], (token?.Value as JoiningOperatorType) ?? OperatorType.AND);
                        }
                    } else {
                        queryTokens.push({
                            Expressions: [expression],
                            JoiningOperator: OperatorType.AND,
                        });

                        expression = null;
                        _tokens.unshift(token);
                    }
                } else {
                    _tokens.unshift(token);
                }
            } else if (expression) {
                expression.Tokens.push(token);
            } else {
                expression = new Expression([token], (operator?.Value as JoiningOperatorType) ?? OperatorType.AND);
            }

            /* Artificial Braces/Compound - Reached end of query, close it off */
            if (_tokens.length === 0 && compoundExpression) {
                _tokens.unshift({
                    Type: TokenType.SYMBOL,
                    Value: SymbolType.RPAREN,
                });
            }
        }
    }

    return queryTokens;
}

export { buildExpressions };

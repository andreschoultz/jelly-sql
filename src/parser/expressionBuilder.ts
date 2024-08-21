import { KeywordType, OperatorType, SymbolType, Token, TokenType } from '@/lexer/types';

import { CompoundExpression, Expression, QueryToken } from './types';

let _tokens: Token[] = [];

/**
 * Parses an array of tokens and constructs an array of query tokens.
 *
 * This function processes a list of tokens to build expressions and compound
 * expressions based on logical operators and symbols (e.g., parentheses).
 * It identifies sections of the token list that represent WHERE clauses and
 * organizes the tokens into structured query tokens.
 *
 * @param tokens - The array of tokens to be processed.
 * @returns An array of query tokens representing the parsed expressions.
 */
function buildExpressions(tokens: Token[]): QueryToken[] {
    _tokens = [...tokens];

    let cutIdx = _tokens.findIndex(x => x.Type === TokenType.KEYWORD && x.Value === KeywordType.WHERE);

    if (cutIdx + 1 < _tokens.length) return [];

    _tokens = _tokens.slice(cutIdx + 1);

    let hasFirstQueryBeenConsumed = false;
    let compoundExpression: CompoundExpression | null = null;
    let expression: Expression | null = null;
    let queryTokens: QueryToken[] = [];

    while (_tokens.length > 0) {
        let operator: Token | null = null;
        const currentQueryTokenCount = queryTokens.length;

        if (hasFirstQueryBeenConsumed) {
            let _token = _tokens.shift();

            if (_token) operator = _token;
        } else {
            operator = { Type: TokenType.OPERATOR, Value: OperatorType.AND };
            hasFirstQueryBeenConsumed = true;
        }

        while (queryTokens.length == currentQueryTokenCount && _tokens.length > 0) {
            let token = _tokens.shift();

            if (!token) continue;

            if (token.Type === TokenType.SYMBOL) {
                if (token.Value == SymbolType.LPAREN && compoundExpression == null) {
                    compoundExpression = {
                        Expressions: [],
                        JoiningOperator: (operator?.Value as OperatorType.AND | OperatorType.OR) ?? OperatorType.AND,
                    };
                } else if (token.Value === SymbolType.RPAREN && compoundExpression && expression) {
                    compoundExpression.Expressions.push(expression);
                    queryTokens.push({ CompoundExpression: compoundExpression });

                    expression = null;
                    compoundExpression = null;
                }
            } else if (token?.Value == OperatorType.AND || token?.Value == OperatorType.OR) {
                if (expression) {
                    if (compoundExpression) {
                        compoundExpression.Expressions.push(expression);

                        expression = {
                            Tokens: [],
                            JoiningOperator: (token?.Value as OperatorType.AND | OperatorType.OR) ?? OperatorType.AND,
                        };
                    } else {
                        queryTokens.push({
                            Expression: expression,
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
                expression = {
                    Tokens: [token],
                    JoiningOperator: (operator?.Value as OperatorType.AND | OperatorType.OR) ?? OperatorType.AND,
                };
            }
        }

        if (expression) {
            const queryTokensCnt = queryTokens.length;
            const previousQueryToken = queryTokensCnt > 0 ? queryTokens[queryTokensCnt - 1] : null;

            /* When a `OR` is next to a `AND`, make the two a compound */
            if (previousQueryToken?.Expression?.JoiningOperator == OperatorType.AND && expression.JoiningOperator == OperatorType.OR) {
                // Previous wasn't a compoundQuery && remainder of `if` statement is true
                queryTokens.pop();

                queryTokens.push({
                    CompoundExpression: {
                        JoiningOperator: OperatorType.AND,
                        Expressions: [previousQueryToken.Expression, expression],
                    },
                });
            } else {
                queryTokens.push({
                    Expression: expression,
                });
            }

            expression = null;
        }
    }

    return queryTokens;
}

export { buildExpressions };

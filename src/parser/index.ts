

import { KeywordType, OperatorType, SymbolType, Token, TokenType } from "@/lexer/types";

import { OperationType } from "./types";

let _tokens: Token[] = [];
let _consumedTokens: Token[] = [];
let _queries: string[] = [];
//let _secondaryParsingTokens: Token[];

const nextToken = () => (_tokens.length > 1 ? _tokens[0] : null);

function consumeToken(tokenType: TokenType, alternateTypes: TokenType[] | null = null): Token {
    const token = _tokens.shift();

    if (!token) {
        throw new Error(`Invalid Type. Expected ${tokenType} or ${alternateTypes?.join(' or ')}, but found no tokens in sequence.`);
    } else if (token?.Type != tokenType && !alternateTypes?.includes(token?.Type)) {
        if ((alternateTypes?.length ?? 0) > 0) {
            throw new Error(`Invalid type. Expected ${tokenType} or ${alternateTypes?.join(' or ')}, but got ${token?.Type} with value ${token?.Value}`);
        } else {
            throw new Error(`Invalid type. Expected ${tokenType}, but got ${token?.Type} with value ${token?.Value}`);
        }
    }

    _consumedTokens.push(token);

    return token;
}

function getSimpleOperationType(value: string, secondaryValue: string | null): OperationType {
    if (value === SymbolType.ASSIGN || value === OperatorType.EQUALS || value === SymbolType.EQ) {
        return OperationType.EQUALS;
    } else if (value === SymbolType.NEQ || value === SymbolType.NEQ_LG || (value === OperatorType.NOT && secondaryValue === OperatorType.EQUALS)) {
        return OperationType.NOT_EQUALS;
    } else if (value === OperatorType.LIKE) {
        return OperationType.LIKE;
    } else if (value === OperatorType.NOT && secondaryValue === OperatorType.LIKE) {
        return OperationType.NOT_LIKE;
    } else if (value === OperatorType.CONTAINS) {
        return OperationType.CONTAINS;
    } else if (value === OperatorType.NOT && secondaryValue === OperationType.CONTAINS) {
        return OperationType.NOT_CONTAINS;
    }

    return OperationType.UNKNOWN;
}

function hasSecondaryOperator(operator: Token, nextToken: Token | null): Boolean {
    if (nextToken == null) return false;

    if (operator.Value === OperatorType.NOT) {
        switch (nextToken.Value) {
            case OperatorType.EQUALS:
                return true;
            case OperatorType.LIKE:
                return true;
            case OperatorType.CONTAINS:
                return true;
        }
    }

    return false;
}

// TODO: Rewrite everything into a attribute handler -> When scope gets added
function handleKeyword(operator: Token, keyword: Token) {
    const comparator = consumeToken(TokenType.OPERATOR, [TokenType.IDENTIFIER, TokenType.SYMBOL]);
    let query = '';

    let secondaryOperator: Token | undefined;

    if (nextToken() && hasSecondaryOperator(comparator, nextToken())) {
        secondaryOperator = consumeToken(TokenType.OPERATOR, [TokenType.IDENTIFIER]);
    }

    if (operator.Value == OperatorType.AND || operator.Value == SymbolType.AND) {
        query += ''; // No spacing
    } else if ((operator.Value = OperatorType.OR || operator.Value == SymbolType.OR)) {
        query += '\u{0020}'; // Whitespace
    }

    const valueToken = consumeToken(TokenType.STRING);
    const simpleComparatorType = getSimpleOperationType(comparator.Value, secondaryOperator?.Value ?? null);

    if (keyword.Value === KeywordType.ID) {

        if (simpleComparatorType === OperationType.EQUALS) {
            query += `#${valueToken.Value}`;
        } else if (simpleComparatorType === OperationType.NOT_EQUALS) {
            query += `:not(#${valueToken.Value})`;
        } else if (simpleComparatorType === OperationType.LIKE) {
            // When you hit this, try to pass it along to the attribute handler. Works the same way
            query += `[id*="${valueToken.Value}"]`;
        } else if (simpleComparatorType === OperationType.NOT_LIKE) {
            query += `:not([id*="${valueToken.Value}"])`;
        }

    } else if (keyword.Value === KeywordType.CLASS) {
        if (simpleComparatorType === OperationType.EQUALS) {
            query += `.${valueToken.Value}`;
        } else if (simpleComparatorType === OperationType.NOT_EQUALS) {
            query += `:not(.${valueToken.Value})`;
        } else if (simpleComparatorType === OperationType.LIKE) {
            // When you hit this, try to pass it along to the attribute handler. Works the same way
            query += `[class*="${valueToken.Value}"]`;
        } else if (simpleComparatorType === OperationType.NOT_LIKE) {
            query += `:not([class*="${valueToken.Value}"])`;
        } else if (simpleComparatorType === OperationType.CONTAINS) {
            query += `[class~="${valueToken.Value}"]`;
        } else if (simpleComparatorType === OperationType.NOT_CONTAINS) {
            query += `:not([class~="${valueToken.Value}"])`;
        }
    } else if (keyword.Value === KeywordType.STYLE) {
        if (simpleComparatorType === OperationType.EQUALS) {
            query += `[style="${valueToken.Value}"]`;
        } else if (simpleComparatorType === OperationType.NOT_EQUALS) {
            query += `:not([style="${valueToken.Value})"]`;
        } else if (simpleComparatorType === OperationType.LIKE) {
            // When you hit this, try to pass it along to the attribute handler. Works the same way
            query += `[style*="${valueToken.Value}"]`;
        } else if (simpleComparatorType === OperationType.NOT_LIKE) {
            query += `:not([style*="${valueToken.Value}"])`;
        } else if (simpleComparatorType === OperationType.CONTAINS) {
            query += `[style~="${valueToken.Value}"]`;
        } else if (simpleComparatorType === OperationType.NOT_CONTAINS) {
            query += `:not([style~="${valueToken.Value}"])`;
        }
    } else if (keyword.Value === KeywordType.ATTRIBUTE) { // Attribute = 'data-color' AND Attribute.Value = 'red' AND Attribute('data-color') = 'red'
        if (simpleComparatorType === OperationType.EQUALS) {
            query += `[${valueToken.Value}]`;
        } else if (simpleComparatorType === OperationType.NOT_EQUALS) {
            query += `:not([${valueToken.Value}])"]`;
        } else if (simpleComparatorType === OperationType.LIKE) {
            // When you hit this, try to pass it along to the attribute handler. Works the same way
            query += `[style*="${valueToken.Value}"]`;
        } else if (simpleComparatorType === OperationType.NOT_LIKE) {
            query += `:not([style*="${valueToken.Value}"])`;
        } else if (simpleComparatorType === OperationType.CONTAINS) {
            query += `[style~="${valueToken.Value}"]`;
        } else if (simpleComparatorType === OperationType.NOT_CONTAINS) {
            query += `:not([style~="${valueToken.Value}"])`;
        }
    }
    
    _queries.push(query);
}

function handleFunction(operator: Token, directive: Token) {
    const comparator = consumeToken(TokenType.OPERATOR, [TokenType.IDENTIFIER, TokenType.SYMBOL]);
    let query = '';

    let secondaryOperator: Token | undefined;

    if (nextToken() && hasSecondaryOperator(comparator, nextToken())) {
        secondaryOperator = consumeToken(TokenType.OPERATOR, [TokenType.IDENTIFIER]);
    }

    if (operator.Value == OperatorType.AND || operator.Value == SymbolType.AND) {
        query += ''; // No spacing
    } else if ((operator.Value = OperatorType.OR || operator.Value == SymbolType.OR)) {
        query += '\u{0020}'; // Whitespace
    }

    if (directive.Value === KeywordType.ATTRIBUTE) {
        if (!directive.Arguments || directive.Arguments.length < 1) {
            throw new Error('Invalid arguments. Expected one argument, but got none.');
        }
        
        const valueToken = consumeToken(TokenType.STRING);
        const simpleComparatorType = getSimpleOperationType(comparator.Value, secondaryOperator?.Value ?? null);
        const attributeName = directive.Arguments[0];

        if (simpleComparatorType === OperationType.EQUALS) {
            query += `[${attributeName}="${valueToken.Value}"]`;
        } else if (simpleComparatorType === OperationType.NOT_EQUALS) {
            query += `:not([${attributeName}="${valueToken.Value}"])`;
        } else if (simpleComparatorType === OperationType.LIKE) {
            query += `[${attributeName}*="${valueToken.Value}"]`;
        } else if (simpleComparatorType === OperationType.NOT_LIKE) {
            query += `:not([${attributeName}*="${valueToken.Value}"])`;
        } else if (simpleComparatorType === OperationType.CONTAINS) {
            query += `[${attributeName}~="${valueToken.Value}"]`;
        }
    }

    _queries.push(query);
}

// TODO: Add scopes & grouping based on `(` & `)`

function parser(tokens: Token[]): String {
    _tokens = [...tokens];
    
    consumeToken(TokenType.KEYWORD); // SELECT
    consumeToken(TokenType.OPERATOR) // *
    consumeToken(TokenType.KEYWORD) // FROM
    consumeToken(TokenType.IDENTIFIER) // Dom
    consumeToken(TokenType.KEYWORD) // WHERE
    
    let hasFirstQueryBeenConsumed = false;

    while (_tokens.length > 0) {
        let operator: Token | null;
        
        if (hasFirstQueryBeenConsumed) {
            operator = consumeToken(TokenType.OPERATOR);
        } else {
            operator = { Type: TokenType.OPERATOR, Value: OperatorType.AND };
            hasFirstQueryBeenConsumed = true;
        }

        const token = consumeToken(TokenType.KEYWORD, [TokenType.FUNCTION]);

        if (token.Type === TokenType.KEYWORD){
            handleKeyword(operator, token);
        } else if (token.Type === TokenType.FUNCTION) {
            handleFunction(operator, token)
        }
    }

    return _queries.join('');
}

export { parser };

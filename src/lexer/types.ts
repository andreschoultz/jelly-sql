enum TokenType {
    KEYWORD = 'KEYWORD',
    IDENTIFIER = 'IDENTIFIER',
    OPERATOR = 'OPERATOR',
    FUNCTION = 'FUNCTION',

    STRING = 'STRING',
    NUMERIC = 'NUMERIC',
    COMMENT = 'COMMENT',

    WHITESPACE = 'WHITESPACE',
    SYMBOL = 'SYMBOL',

    UNKNOWN = 'UNKNOWN',
}

enum KeywordType {
    SELECT = 'SELECT',
    FROM = 'FROM',
    WHERE = 'WHERE',

    TAG = 'TAG', // TAG == ELEMENT
    ELEMENT = 'ELEMENT', // ELEMENT == TAG
    ID = 'ID',
    CLASS = 'CLASS',
    ATTRIBUTE = 'ATTRIBUTE', // ATTRIBUTE == ATR
    ATTR = 'ATTR', // ATR == ATTRIBUTE
    STYLE = 'STYLE',
}

enum OperatorType {
    EQUALS = 'EQUALS',
    AND = 'AND',
    OR = 'OR',
    NOT = 'NOT',
    LIKE = 'LIKE',
    CONTAINS = 'CONTAINS',
}

enum FunctionType {
    ATTRIBUTE = 'ATTRIBUTE', // ATTRIBUTE == ATR
    ATTR = 'ATTR', // ATR == ATTRIBUTE
    TAG = 'TAG',
}

enum CompoundType {
    NOT_EQUALS = 'NOT EQUALS',
    NOT_LIKE = 'NOT LIKE',
}

enum SymbolType {
    LPAREN = '(',
    RPAREN = ')',
    LBRACKET = '[',
    RBRACKET = '[',
    LBRACE = '{',
    RBRACE = '}',

    COMMA = ',',
    SEMI = ';',

    PLUS = '+',
    MINUS = '-',
    TIMES = '*',
    DIVIDE = '/',

    PERCENT = '%',

    ASSIGN = '=',
    AND = '&&',
    OR = '||',
    EQ = '==',
    NEQ = '!=',
    NEQ_LG = '<>',
    GT = '>',
    LT = '<',
    GEQ = '>=',
    LEQ = '<=',
}

interface Token {
    Type: TokenType;
    Value: string;
    Field?: string | null;
    Arguments?: string[] | null;
}

interface TokenIdentifier {
    Identifier: string;
    Type: TokenType;
}

export type { Token, TokenIdentifier };
export { TokenType, KeywordType, OperatorType, SymbolType, CompoundType, FunctionType };

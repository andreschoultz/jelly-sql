enum TokenType {
    KEYWORD = 'KEYWORD',
    IDENTIFIER = 'IDENTIFIER',
    OPERATOR = 'OPERATOR',
    FUNCTION = 'FUNCTION',
    EXPRESSION = 'EXPRESSION',

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
    AS = 'AS',

    TAG = 'TAG', // TAG == ELEMENT
    ELEMENT = 'ELEMENT', // ELEMENT == TAG
    ID = 'ID',
    CLASS = 'CLASS',
    ATTRIBUTE = 'ATTRIBUTE', // ATTRIBUTE == ATR
    ATTR = 'ATTR', // ATR == ATTRIBUTE
    STYLE = 'STYLE',

    /* Pseudo Selectors - Structural */
    FIRST = 'FIRST',
    LAST = 'LAST',
    ODD = 'ODD',
    EVEN = 'EVEN',
    ONLY = 'ONLY',
    EMPTY = 'EMPTY',

    /* Pseudo Selectors - Link */
    LINK = 'LINK',
    VISITED = 'VISITED',

    /* Pseudo Selectors - User Action */
    ACTIVE = 'ACTIVE',
    HOVER = 'HOVER',
    FOCUS = 'FOCUS',

    /* Pseudo Selectors - UI Element */
    ENABLED = 'ENABLED',
    DISABLED = 'DISABLED',
    CHECKED = 'CHECKED',

    /* Pseudo Selectors - Misc */
    FIRSTLINE = 'FIRSTLINE',
    FIRSTLETTER = 'FIRSTLETTER',
    TARGET = 'TARGET',
    BEFORE = 'BEFORE',
    AFTER = 'AFTER',
}

enum OperatorType {
    EQUALS = 'EQUALS',
    AND = 'AND',
    OR = 'OR',
    NOT = 'NOT',
    LIKE = 'LIKE',
    CONTAINS = 'CONTAINS',

    /* Combinators */
    CHILD = 'CHILD',
    SIBLING = 'SIBLING',
    NEXT = 'NEXT',
    WITHIN = 'WITHIN',
    OF = 'OF',
    TO = 'TO',
    CHILD_OF = 'CHILD OF',
    NEXT_TO = 'NEXT TO',
    SIBLING_OF = 'SIBLING OF',
}

enum FunctionType {
    ATTRIBUTE = 'ATTRIBUTE', // ATTRIBUTE == ATR
    ATTR = 'ATTR', // ATR == ATTRIBUTE
    TAG = 'TAG',
    CHILD = 'CHILD',
    TYPEOF = 'TYPEOF', // Equal representation for the `of-type` in structural pseudo selectors
    LANGUAGE = 'LANGUAGE', // LANGUAGE == LANG
    LANG = 'LANG', // LANG == LANGUAGE
}

enum CompoundType {
    NOT_EQUALS = 'NOT EQUALS',
    NOT_LIKE = 'NOT LIKE',
    CHILD_OF = 'CHILD OF',
    NEXT_TO = 'NEXT TO',
    SIBLING_OF = 'SIBLING OF',
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
    TILDE = '~',

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
    Arguments?: Token[] | null;
}

interface TokenIdentifier {
    Identifier: string;
    Type: TokenType;
}

export type { Token, TokenIdentifier };
export { TokenType, KeywordType, OperatorType, SymbolType, CompoundType, FunctionType };

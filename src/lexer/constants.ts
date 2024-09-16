import { FunctionType, KeywordType, OperatorType, SymbolType, TokenType } from './types';

/** ------ Lookup Lists ------ */

const keywords: { [key: string]: TokenType } = {
    [KeywordType.SELECT]: TokenType.KEYWORD,
    [KeywordType.FROM]: TokenType.KEYWORD,
    [KeywordType.WHERE]: TokenType.KEYWORD,

    [KeywordType.TAG]: TokenType.KEYWORD,
    [KeywordType.ELEMENT]: TokenType.KEYWORD,
    [KeywordType.ID]: TokenType.KEYWORD,
    [KeywordType.CLASS]: TokenType.KEYWORD,
    [KeywordType.ATTRIBUTE]: TokenType.KEYWORD,
    [KeywordType.ATTR]: TokenType.KEYWORD,
    [KeywordType.STYLE]: TokenType.KEYWORD,
} as const;

const operators: { [key: string]: TokenType } = {
    [SymbolType.ASSIGN]: TokenType.OPERATOR,
    [SymbolType.EQ]: TokenType.OPERATOR,
    [SymbolType.NEQ]: TokenType.OPERATOR,
    [SymbolType.NEQ_LG]: TokenType.OPERATOR,
    [SymbolType.TIMES]: TokenType.OPERATOR,

    [OperatorType.EQUALS]: TokenType.OPERATOR,
    [OperatorType.AND]: TokenType.OPERATOR,
    [OperatorType.OR]: TokenType.OPERATOR,
    [OperatorType.NOT]: TokenType.OPERATOR,
    [OperatorType.LIKE]: TokenType.OPERATOR,
    [OperatorType.CONTAINS]: TokenType.OPERATOR,
    [OperatorType.CHILD]: TokenType.OPERATOR,
    [OperatorType.SIBLING]: TokenType.OPERATOR,
    [OperatorType.WITHIN]: TokenType.OPERATOR,
    [OperatorType.OF]: TokenType.OPERATOR,
    [OperatorType.TO]: TokenType.OPERATOR,
} as const;

const logicalOperators: OperatorType[] = [OperatorType.AND, OperatorType.OR];

const functions: { [key: string]: TokenType } = {
    [FunctionType.ATTRIBUTE]: TokenType.FUNCTION,
    [FunctionType.ATTR]: TokenType.FUNCTION,
};

/** ------ Regex ------ */

const Regex = {
    identifier: /^[a-zA-Z_][a-zA-Z0-9_]*/,
    string: /^'([^']|'')*'/,
    numeric: /^[0-9]*$/,
    whitespace: /^\s+/,
    comment: /^(--[^\n]*|\/\*[\s\S]*?\*\/)/,
    symbol: /^[,;()]/,
    function: /^\w+\s*\([^)]*\)/,
};

export { Regex, keywords, operators, logicalOperators, functions };

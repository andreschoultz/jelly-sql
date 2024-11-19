import { FunctionType, KeywordType, OperatorType, SymbolType, TokenType } from './types';

/** ------ Lookup Lists ------ */

const keywords: { [key: string]: TokenType } = {
    [KeywordType.SELECT]: TokenType.KEYWORD,
    [KeywordType.FROM]: TokenType.KEYWORD,
    [KeywordType.WHERE]: TokenType.KEYWORD,
    [KeywordType.AS]: TokenType.KEYWORD,

    [KeywordType.TAG]: TokenType.KEYWORD,
    [KeywordType.ELEMENT]: TokenType.KEYWORD,
    [KeywordType.ID]: TokenType.KEYWORD,
    [KeywordType.CLASS]: TokenType.KEYWORD,
    [KeywordType.ATTRIBUTE]: TokenType.KEYWORD,
    [KeywordType.ATTR]: TokenType.KEYWORD,
    [KeywordType.STYLE]: TokenType.KEYWORD,

    /* Pseudo Selectors - Structural */
    [KeywordType.FIRST]: TokenType.KEYWORD,
    [KeywordType.LAST]: TokenType.KEYWORD,
    [KeywordType.ODD]: TokenType.KEYWORD,
    [KeywordType.EVEN]: TokenType.KEYWORD,
    [KeywordType.ONLY]: TokenType.KEYWORD,
    [KeywordType.EMPTY]: TokenType.KEYWORD,
    [KeywordType.ROOT]: TokenType.KEYWORD,

    /* Pseudo Selectors - Link */
    [KeywordType.LINK]: TokenType.KEYWORD,
    [KeywordType.VISITED]: TokenType.KEYWORD,

    /* Pseudo Selectors - User Action */
    [KeywordType.ACTIVE]: TokenType.KEYWORD,
    [KeywordType.HOVER]: TokenType.KEYWORD,
    [KeywordType.FOCUS]: TokenType.KEYWORD,

    /* Pseudo Selectors - UI Element */
    [KeywordType.ENABLED]: TokenType.KEYWORD,
    [KeywordType.DISABLED]: TokenType.KEYWORD,
    [KeywordType.CHECKED]: TokenType.KEYWORD,

    /* Pseudo Selectors - Misc */
    [KeywordType.FIRSTLINE]: TokenType.KEYWORD,
    [KeywordType.FIRSTLETTER]: TokenType.KEYWORD,
    [KeywordType.TARGET]: TokenType.KEYWORD,
    [KeywordType.BEFORE]: TokenType.KEYWORD,
    [KeywordType.AFTER]: TokenType.KEYWORD,
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
    [OperatorType.NEXT]: TokenType.OPERATOR,
    [OperatorType.WITHIN]: TokenType.OPERATOR,
    [OperatorType.OF]: TokenType.OPERATOR,
    [OperatorType.TO]: TokenType.OPERATOR,
    [OperatorType.CHILD_OF]: TokenType.OPERATOR,
    [OperatorType.NEXT_TO]: TokenType.OPERATOR,
    [OperatorType.SIBLING_OF]: TokenType.OPERATOR,
} as const;

const functions: { [key: string]: TokenType } = {
    [FunctionType.ATTRIBUTE]: TokenType.FUNCTION,
    [FunctionType.ATTR]: TokenType.FUNCTION,
    [FunctionType.TAG]: TokenType.FUNCTION,
    [FunctionType.CHILD]: TokenType.FUNCTION,
    [FunctionType.TYPEOF]: TokenType.FUNCTION,
    [FunctionType.LANGUAGE]: TokenType.FUNCTION,
    [FunctionType.LANG]: TokenType.FUNCTION,
};

const standaloneFunctions: { [key: string]: TokenType } = {
    [FunctionType.TYPEOF]: TokenType.FUNCTION,
};

const tokenSequenceReplaceables: { [key: string]: OperatorType[] } = {
    [OperatorType.CHILD_OF]: [OperatorType.CHILD, OperatorType.OF],
    [OperatorType.NEXT_TO]: [OperatorType.NEXT, OperatorType.TO],
    [OperatorType.SIBLING_OF]: [OperatorType.SIBLING, OperatorType.OF],
};

const orOperatorSubstitutes = [OperatorType.CHILD_OF, OperatorType.SIBLING_OF, OperatorType.NEXT_TO, OperatorType.WITHIN] as const;

/** ------ Regex ------ */

const Regex = {
    identifier: /^[a-zA-Z_][a-zA-Z0-9_]*/,
    string: /^'([^']|'')*'/,
    numeric: /^[0-9]*$/,
    whitespace: /^\s+/,
    comment: /^(--[^\n]*|\/\*[\s\S]*?\*\/)/,
    symbol: /^[,;()]/,
    function: /^\w+\s*\([^)]*\)/,
    expression: /^[+-]?\s*\d*\s*N\s*(?:[+-]\s*\d+)?$|^[+-]?\s*\d+$|^\s*n\s*/,
    comments: /^(--.*)|(((\/\*)+?[\w\W]+?(\*\/)+))/, // From [Remove SQL Comments by Mohinesh Patil](https://www.regexr.com/3gcrs)
};

export { Regex, keywords, operators, functions, standaloneFunctions, tokenSequenceReplaceables, orOperatorSubstitutes };

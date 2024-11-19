import { KeywordType, OperatorType, SymbolType } from '@/lexer/types';

const keywordPriority: { [key: string]: number } = {
    [KeywordType.TAG]: 1,
    [KeywordType.ELEMENT]: 1,
    [KeywordType.ID]: 2,
    [KeywordType.CLASS]: 3,
    [KeywordType.ATTRIBUTE]: 5,
    [KeywordType.ATTR]: 5,
} as const;

const combinatorSeparators: { [key: string]: string } = {
    [OperatorType.CHILD_OF]: SymbolType.GT,
    [OperatorType.WITHIN]: ' ', // Whitespace
    [OperatorType.NEXT_TO]: SymbolType.PLUS,
    [OperatorType.SIBLING_OF]: SymbolType.TILDE,
} as const;

const pseudoKeywordSelector: { [key: string]: string } = {
    [KeywordType.LINK]: 'link',
    [KeywordType.VISITED]: 'visited',
    [KeywordType.ACTIVE]: 'active',
    [KeywordType.HOVER]: 'hover',
    [KeywordType.FOCUS]: 'focus',
    [KeywordType.ENABLED]: 'enabled',
    [KeywordType.DISABLED]: 'disabled',
    [KeywordType.CHECKED]: 'checked',
    [KeywordType.FIRSTLINE]: 'first-line',
    [KeywordType.FIRSTLETTER]: 'first-letter',
    [KeywordType.TARGET]: 'target',
    [KeywordType.BEFORE]: 'before',
    [KeywordType.AFTER]: 'after',
} as const;

export { keywordPriority, combinatorSeparators, pseudoKeywordSelector };

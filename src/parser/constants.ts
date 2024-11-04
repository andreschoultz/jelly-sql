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

export { keywordPriority, combinatorSeparators };

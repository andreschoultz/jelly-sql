import { KeywordType } from '@/lexer/types';

const keywordPriority: { [key: string]: number } = {
    [KeywordType.TAG]: 1,
    [KeywordType.ELEMENT]: 1,
    [KeywordType.ID]: 2,
    [KeywordType.CLASS]: 3,
    [KeywordType.ATTRIBUTE]: 5,
    [KeywordType.ATTR]: 5,
};

export { keywordPriority };

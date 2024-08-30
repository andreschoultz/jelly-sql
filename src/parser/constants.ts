import { KeywordType } from '@/lexer/types';

const keywordPriority: { [key: string]: number } = {
    [KeywordType.TAG]: 1,
    [KeywordType.ELEMENT]: 2,
    [KeywordType.ID]: 3,
    [KeywordType.CLASS]: 4,
};

export { keywordPriority };

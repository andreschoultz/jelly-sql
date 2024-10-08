import { KeywordType, OperatorType, SymbolType, Token } from '@/lexer/types';

import { Expression, OperationType } from './types';

function getAttributeName(token: Token): string {
    switch (token.Value) {
        case KeywordType.ID:
            return 'id';
        case KeywordType.CLASS:
            return 'class';
        case KeywordType.STYLE:
            return 'style';
        default:
            throw new Error(`Unable to parse attribute name. Expected keyword ${KeywordType.ID}, ${KeywordType.CLASS} or ${KeywordType.STYLE}.`);
    }
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

function deepCopy<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (obj instanceof Expression) {
        const tokensCopy = deepCopy(obj.Tokens);
        return new Expression(tokensCopy, obj.JoiningOperator) as unknown as T;
    }

    // If the object is an array, create a new array and deep copy each element
    if (Array.isArray(obj)) {
        return obj.map(item => deepCopy(item)) as unknown as T;
    }

    const copy: any = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            copy[key] = deepCopy(obj[key]);
        }
    }

    return copy;
}

export { getAttributeName, getSimpleOperationType, deepCopy };

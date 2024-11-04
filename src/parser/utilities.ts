import { orOperatorSubstitutes } from '@/lexer/constants';
import { KeywordType, OperatorType, SymbolType, Token, TokenType } from '@/lexer/types';

import { combinatorSeparators } from './constants';
import { Expression, JoiningOperatorType, OperationType } from './types';

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
    } else if (value === OperatorType.NOT && secondaryValue === OperatorType.CONTAINS) {
        return OperationType.NOT_CONTAINS;
    } else if (value === OperatorType.CHILD && secondaryValue === OperatorType.OF) {
        return OperationType.CHILD_OF;
    } else if (value === OperatorType.SIBLING && secondaryValue === OperatorType.OF) {
        return OperationType.SIBLING_OF;
    } else if (value === OperatorType.NEXT && secondaryValue === OperatorType.TO) {
        return OperationType.NEXT_TO;
    } else if (value === OperatorType.WITHIN) {
        return OperationType.WITHIN;
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

function isValueToken(token: Token | null): boolean {
    if (!token) {
        return false;
    }

    return token.Type === TokenType.STRING || token.Type === TokenType.NUMERIC;
}

/**
 * Determines if the token is an OR operator or a substitute for an OR operator.
 *
 * @param token - The token to be evaluated.
 * @returns `true` if the token is an OR operator or a substitute for an OR operator, otherwise, `false`.
 */
function isOrSubstitute(token: Token | null): boolean {
    if (!token) {
        return false;
    }

    if (token.Value == OperatorType.OR) {
        return true;
    } else if (isCombinatorOperator(token.Value)) {
        return true;
    }

    return false;
}

function isCombinatorOperator(joiningOperator: JoiningOperatorType | string | null | undefined): boolean {
    if (!joiningOperator) {
        return false;
    }

    return orOperatorSubstitutes.some(x => x == joiningOperator);
}

function getCombinatorSeparator(joiningOperator: JoiningOperatorType | null | undefined): string {
    if (!joiningOperator) {
        return '';
    }

    let selector = combinatorSeparators[joiningOperator];

    if (!selector) {
        return '';
    }

    if (!selector.startsWith(' ')) {
        selector = ` ${selector}`;
    }

    if (!selector.endsWith(' ')) {
        selector += ' ';
    }

    return selector;
}

export { getAttributeName, getSimpleOperationType, deepCopy, isValueToken, isCombinatorOperator, isOrSubstitute, getCombinatorSeparator };

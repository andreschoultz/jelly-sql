import { FunctionType, OperatorType, Token, TokenType } from '@/lexer/types';

function hasSecondaryOperator(operator: Token, nextToken: Token | null): boolean {
    if (nextToken == null) return false;

    if (operator.Value === OperatorType.NOT) {
        switch (nextToken.Value) {
            case OperatorType.EQUALS:
                return true;
            case OperatorType.LIKE:
                return true;
            case OperatorType.CONTAINS:
                return true;
        }
    }

    return false;
}

function isPseudoSelector(token: Token): boolean {
    if (token.Value === FunctionType.CHILD && token.Type === TokenType.FUNCTION) {
        return true;
    }

    return false;
}

export { hasSecondaryOperator, isPseudoSelector };

import { OperatorType, Token } from '@/lexer/types';

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

export { hasSecondaryOperator };

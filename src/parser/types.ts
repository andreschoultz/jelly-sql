import { OperatorType, Token } from '@/lexer/types';

enum OperationType {
    UNKNOWN = 'UNKNOWN',
    EQUALS = 'EQUALS',
    NOT_EQUALS = 'NOT_EQUALS',
    CONTAINS = 'CONTAINS',
    NOT_CONTAINS = 'NOT_CONTAINS',
    LIKE = 'LIKE',
    NOT_LIKE = 'NOT_LIKE',
}

interface Expression {
    Tokens: Token[];
    JoiningOperator: OperatorType.AND | OperatorType.OR;
}

interface CompoundExpression {
    Expressions: Expression[];
    JoiningOperator: OperatorType.AND | OperatorType.OR;
}

interface QueryToken {
    Expression?: Expression | null;
    CompoundExpression?: CompoundExpression | null;
}

export { OperationType };
export type { Expression, CompoundExpression, QueryToken };

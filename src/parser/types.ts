import { KeywordType, OperatorType, Token, TokenType } from '@/lexer/types';

enum OperationType {
    UNKNOWN = 'UNKNOWN',
    EQUALS = 'EQUALS',
    NOT_EQUALS = 'NOT_EQUALS',
    CONTAINS = 'CONTAINS',
    NOT_CONTAINS = 'NOT_CONTAINS',
    LIKE = 'LIKE',
    NOT_LIKE = 'NOT_LIKE',
}

class Expression {
    Tokens: Token[];
    JoiningOperator: JoiningOperatorType;

    constructor(tokens: Token[], joiningOperator: JoiningOperatorType) {
        this.Tokens = tokens;
        this.JoiningOperator = joiningOperator;
    }

    consumeToken(tokenType: TokenType, alternateTypes: TokenType[] | null = null): Token {
        const token = this.Tokens.shift();

        if (!token) {
            throw new Error(`Invalid Type. Expected ${tokenType} or ${alternateTypes?.join(' or ')}, but found no tokens in sequence.`);
        } else if (token?.Type != tokenType && !alternateTypes?.includes(token?.Type)) {
            if ((alternateTypes?.length ?? 0) > 0) {
                throw new Error(`Invalid type. Expected ${tokenType} or ${alternateTypes?.join(' or ')}, but got ${token?.Type} with value ${token?.Value}`);
            } else {
                throw new Error(`Invalid type. Expected ${tokenType}, but got ${token?.Type} with value ${token?.Value}`);
            }
        }

        return token;
    }

    nextToken(): Token | null {
        return this.Tokens.length > 0 ? this.Tokens[0] : null;
    }
}

type JoiningOperatorType = OperatorType.AND | OperatorType.OR;

interface CompoundExpression {
    Expressions: Expression[];
    JoiningOperator: JoiningOperatorType;
}

interface QueryToken {
    Expressions: Expression[];
    JoiningOperator?: JoiningOperatorType;
}

interface Selector {
    Value: string;
    KeywordType: KeywordType;
    JoiningOperator: JoiningOperatorType;
}

interface SelectorGroup {
    Selectors: Selector[];
}

export { OperationType, Expression };
export type { CompoundExpression, QueryToken, Selector, SelectorGroup, JoiningOperatorType };

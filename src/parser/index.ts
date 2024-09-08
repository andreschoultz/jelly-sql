import { KeywordType, OperatorType, SymbolType, Token, TokenType } from '@/lexer/types';

import { keywordPriority } from './constants';
import { buildExpressions } from './expressionBuilder';
import { Expression, OperationType, QueryToken, Selector, SelectorGroup } from './types';
import { getAttributeName, getSimpleOperationType } from './utilities';
import { hasSecondaryOperator } from './validators';

/**
 * Processes a single QueryToken to create selector groups.
 * A selector group represents a logical grouping of selectors based on their joining operators.
 * Selectors joined by the AND operator are grouped together, while selectors with other operators (like OR) are separated into their own groups.
 *
 * @param queryToken - The QueryToken object containing an array of expressions and the joining operator between them.
 * @returns An array of SelectorGroup objects, each representing a logical group of selectors.
 */
function createSelectors(queryToken: QueryToken): SelectorGroup[] {
    let selectors: Selector[] = [];
    let groupings: SelectorGroup[] = [];

    for (let i = 0; i < queryToken.Expressions.length; i++) {
        const selector = createSelector(queryToken.Expressions[i]);

        if (selector.JoiningOperator === OperatorType.AND) {
            selectors.push(selector);
        } else {
            groupings.push({ Selectors: [selector] });
        }
    }

    if (selectors.length > 0) {
        groupings.unshift({ Selectors: selectors });
    }

    return groupings;
}

/**
 * Groups selectors from multiple QueryTokens into a combined set of selector groups.
 * This function manages the merging of selectors based on their joining operators,
 * combining those joined by AND and separating those with other operators.
 *
 * @param queryTokens - An array of QueryToken objects, each containing expressions and operators.
 * @returns An array of SelectorGroup objects, where each group represents a logical combination of selectors.
 */
function groupSelectors(queryTokens: QueryToken[]): SelectorGroup[] {
    let groupings: SelectorGroup[] = [];

    for (let i = 0; i < queryTokens.length; i++) {
        const queryGroupings = createSelectors(queryTokens[i]);
        const lastGrouping = queryTokens[i].JoiningOperator === OperatorType.AND ? groupings.pop() : null;

        for (let j = 0; j < queryGroupings.length; j++) {
            groupings.push({
                Selectors: [...(lastGrouping?.Selectors ?? []), ...queryGroupings[j].Selectors],
            });
        }
    }

    for (let i = 0; i < groupings.length; i++) {
        groupings[i].Selectors = groupings[i].Selectors.sort((a, b) => {
            if (keywordPriority[a.KeywordType] && keywordPriority[b.KeywordType]) {
                return keywordPriority[a.KeywordType] - keywordPriority[b.KeywordType];
            }

            return 0;
        });
    }

    return groupings;
}

/**
 * Generates a query string from an array of selector groups.
 * Each group is converted into a sub-query string, which are then concatenated
 * into a final query string.
 *
 * @param groupings - An array of SelectorGroup objects representing grouped selectors.
 * @returns A string representing the combined query built from the selector groups.
 */
function generateQuery(groupings: SelectorGroup[]): string {
    let query = '';

    for (let i = 0; i < groupings.length; i++) {
        let subQuery = '';

        for (let j = 0; j < groupings[i].Selectors.length; j++) {
            subQuery += groupings[i].Selectors[j].Value;
        }

        query += i === 0 ? subQuery : `, ${subQuery}`;
    }

    return query;
}

/**
 * Constructs a Selector object from a given expression.
 * This function interprets the expression's tokens to determine the type of selector
 * (e.g., ID, class, tag, attribute) and its value. It handles special cases for
 * different selector types and throws an error for unsupported types.
 *
 * @param expression - The Expression object containing tokens to be processed into a selector.
 * @returns A Selector object representing a single CSS-like selector.
 */
function createSelector(expression: Expression): Selector {
    const keyword = expression.consumeToken(TokenType.KEYWORD, [TokenType.FUNCTION]);
    const comparator = expression.consumeToken(TokenType.OPERATOR, [TokenType.IDENTIFIER, TokenType.SYMBOL]);
    let secondaryOperator: Token | undefined;

    if (expression.nextToken() && hasSecondaryOperator(comparator, expression.nextToken())) {
        secondaryOperator = expression.consumeToken(TokenType.OPERATOR, [TokenType.IDENTIFIER]);
    }

    const valueToken = expression.consumeToken(TokenType.STRING);
    const simpleComparatorType = getSimpleOperationType(comparator.Value, secondaryOperator?.Value ?? null);

    let basicSelector = '';

    if (keyword.Value === KeywordType.TAG || keyword.Value === KeywordType.ELEMENT) {
        basicSelector = valueToken.Value;
    } else if (keyword.Value === KeywordType.ID) {
        basicSelector = getIdSelector(keyword, simpleComparatorType, valueToken);
    } else if (keyword.Value === KeywordType.CLASS) {
        basicSelector = getClassSelector(keyword, simpleComparatorType, valueToken);
    } else if (keyword.Value === KeywordType.ATTRIBUTE || keyword.Value === KeywordType.STYLE) {
        basicSelector = getAttributeSelector(keyword, simpleComparatorType, valueToken);
    } else {
        throw new Error(`Unable to handle foreign selector of type ${keyword.Value}.`);
    }

    if (simpleComparatorType === OperationType.NOT_CONTAINS || simpleComparatorType === OperationType.NOT_EQUALS || simpleComparatorType === OperationType.NOT_LIKE) {
        basicSelector = `:not(${basicSelector})`;
    }

    return {
        Value: basicSelector,
        KeywordType: keyword.Value as KeywordType,
        JoiningOperator: expression.JoiningOperator,
    };
}

/**
 * Creates an attribute or style selector string based on the operation type.
 * Handles different operation types (e.g., equals, like, contains) to generate the correct
 * CSS selector format for attributes and styles.
 *
 * @param keyword - The token representing the attribute or style keyword.
 * @param simpleComparatorType - The operation type to determine the comparison operator in the selector.
 * @param valueToken - The token containing the attribute or style value.
 * @returns A string representing the attribute selector in CSS format.
 */
function getAttributeSelector(keyword: Token, simpleComparatorType: OperationType, valueToken: Token): string {
    if (keyword.Value === KeywordType.ATTRIBUTE && keyword.Type !== TokenType.FUNCTION) {
        return `[${valueToken.Value}]`;
    }

    const attributeName = keyword.Type === TokenType.FUNCTION ? (keyword?.Arguments?.[0] ?? '') : getAttributeName(keyword);
    let selector = '';

    switch (simpleComparatorType) {
        case OperationType.EQUALS:
        case OperationType.NOT_EQUALS:
            selector = '=';
            break;
        case OperationType.LIKE:
        case OperationType.NOT_LIKE:
            const hasStart = valueToken.Value.startsWith(SymbolType.PERCENT);
            const hasEnd = valueToken.Value.endsWith(SymbolType.PERCENT);

            if (hasStart && !hasEnd) {
                selector = '^=';
            } else if (!hasStart && hasEnd) {
                selector = '$=';
            } else {
                selector = '*=';
            }

            valueToken.Value = valueToken.Value.slice(hasStart ? 1 : 0, hasEnd ? valueToken.Value.length - 1 : undefined);

            break;
        case OperationType.CONTAINS:
        case OperationType.NOT_CONTAINS:
            selector = '~=';
            break;
        default:
            throw new Error(`Invalid simple comparator type: ${simpleComparatorType}`);
    }

    return `[${attributeName}${selector}"${valueToken.Value}"]`;
}

/**
 * Generates an ID selector string or falls back to an attribute selector if necessary.
 * This function primarily creates ID selectors but uses attribute selectors for
 * more complex comparison operations.
 *
 * @param keyword - The token representing the ID keyword.
 * @param simpleComparatorType - The operation type to determine how the ID is compared.
 * @param valueToken - The token containing the ID value.
 * @returns A string representing the ID selector in CSS format, or an attribute selector if needed.
 */
function getIdSelector(keyword: Token, simpleComparatorType: OperationType, valueToken: Token): string {
    if (simpleComparatorType === OperationType.EQUALS || simpleComparatorType === OperationType.NOT_EQUALS) {
        return `#${valueToken.Value}`;
    } else {
        return getAttributeSelector(keyword, simpleComparatorType, valueToken);
    }
}

/**
 * Generates a class selector string or falls back to an attribute selector if necessary.
 * This function primarily creates class selectors but uses attribute selectors for
 * more complex comparison operations.
 *
 * @param keyword - The token representing the class keyword.
 * @param simpleComparatorType - The operation type to determine how the class is compared.
 * @param valueToken - The token containing the class value.
 * @returns A string representing the class selector in CSS format, or an attribute selector if needed.
 */
function getClassSelector(keyword: Token, simpleComparatorType: OperationType, valueToken: Token): string {
    if (simpleComparatorType === OperationType.EQUALS || simpleComparatorType === OperationType.NOT_EQUALS) {
        return `.${valueToken.Value}`;
    } else {
        return getAttributeSelector(keyword, simpleComparatorType, valueToken);
    }
}

/**
 * Main parser function that processes an array of tokens into a structured query string.
 * It builds expressions from tokens, groups selectors, and generates the final query string.
 * This function integrates the overall parsing logic to transform raw tokens into a formatted query.
 *
 * @param tokens - An array of Token objects representing the input to be parsed.
 * @returns A string representing the parsed and formatted query.
 */
function parser(tokens: Token[]): String {
    const queryTokens = buildExpressions([...tokens]);
    //console.log('Query Tokens: ', deepCopy(queryTokens));

    const groupings = groupSelectors(queryTokens);
    //console.log('Groupings: ', groupings);

    const query = generateQuery(groupings);

    return query;
}

export { parser };

import { FunctionType, KeywordType, OperatorType, SymbolType, Token, TokenType } from '@/lexer/types';

import { keywordPriority } from './constants';
import { buildExpressions } from './expressionBuilder';
import { Expression, OperationType, QueryToken, Selector, SelectorGroup } from './types';
import { getAttributeName, getCombinatorSeparator, getSimpleOperationType, isCombinatorOperator, isValueToken } from './utilities';
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

    let previousSelector: Selector | null = null;

    for (let i = 0; i < queryToken.Expressions.length; i++) {
        const selector = createSelector(queryToken.Expressions[i]);

        if (selector.JoiningOperator === OperatorType.OR && (previousSelector?.JoiningOperator === OperatorType.AND || previousSelector?.JoiningOperator === OperatorType.OR)) {
            groupings.push({ Selectors: [...selectors] });
            selectors = [];
        }

        selectors.push(selector);
        previousSelector = selector;
    }

    if (selectors.length > 0) {
        groupings.push({ Selectors: selectors });
    }

    return groupings;
}

/**
 * Groups selectors from multiple QueryTokens into a combined set of selector groups.
 * This function manages the merging of selectors based on their joining operators,
 * combining those joined by `AND` or `combinator operators` and separating those with other operators.
 *
 * @param queryTokens - An array of QueryToken objects, each containing expressions and operators.
 * @returns An array of SelectorGroup objects, where each group represents a logical combination of selectors.
 */
function groupSelectors(queryTokens: QueryToken[]): SelectorGroup[] {
    let groupings: SelectorGroup[] = [];

    for (let i = 0; i < queryTokens.length; i++) {
        const queryGroupings = createSelectors(queryTokens[i]);
        const lastGrouping = queryTokens[i].JoiningOperator === OperatorType.AND || isCombinatorOperator(queryTokens[i].JoiningOperator) ? groupings.pop() : null;

        for (let j = 0; j < queryGroupings.length; j++) {
            groupings.push({
                Selectors: [...(lastGrouping?.Selectors ?? []), ...queryGroupings[j].Selectors],
            });
        }
    }

    for (let i = 0; i < groupings.length; i++) {
        // Move combinator operators to the front of the group, but within 'OR' groupings
        const combinatorSelectors = groupings[i].Selectors.filter(selector => isCombinatorOperator(selector.JoiningOperator)).reverse(); // Combinators next to each other should be in reverse order too
        const otherSelectors = groupings[i].Selectors.filter(selector => !isCombinatorOperator(selector.JoiningOperator));

        const orIdx = otherSelectors.findIndex(selector => selector.JoiningOperator === OperatorType.OR);

        if (orIdx !== -1) {
            groupings[i].Selectors = [...otherSelectors.slice(0, orIdx + 1), ...combinatorSelectors, ...otherSelectors.slice(orIdx + 1)];
        } else {
            groupings[i].Selectors = [...combinatorSelectors, ...otherSelectors];
        }

        // Now sort the non-combinator selectors within the group based on their keyword priority
        groupings[i].Selectors = groupings[i].Selectors.sort((a, b) => {
            if (keywordPriority[a.KeywordType] && keywordPriority[b.KeywordType] && !isCombinatorOperator(a.JoiningOperator)) {
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
            subQuery += groupings[i].Selectors[j].Value + getCombinatorSeparator(groupings[i].Selectors[j].JoiningOperator);
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
    let comparator: Token | null = null;
    let simpleComparatorType = OperationType.EQUALS;
    let secondaryOperator: Token | undefined;

    // Don't parse for comparator-less expressions. Ex. `...WHERE TAG('a')`
    if (isValueToken(expression.nextToken()) == false && expression.nextToken()) {
        comparator = expression.consumeToken(TokenType.OPERATOR, [TokenType.IDENTIFIER, TokenType.SYMBOL]);

        if (expression.nextToken() && hasSecondaryOperator(comparator, expression.nextToken())) {
            secondaryOperator = expression.consumeToken(TokenType.OPERATOR, [TokenType.IDENTIFIER]);
        }

        simpleComparatorType = getSimpleOperationType(comparator.Value, secondaryOperator?.Value ?? null);
    }

    let basicSelector = '';

    if (keyword.Value === KeywordType.TAG || keyword.Value === KeywordType.ELEMENT) {
        if (keyword.Type === TokenType.FUNCTION) {
            basicSelector = keyword.Arguments?.[0].Value ?? '';
        } else {
            const valueToken = expression.consumeToken(TokenType.STRING);
            basicSelector = valueToken.Value;
        }
    } else if (keyword.Value === KeywordType.ID) {
        const valueToken = expression.consumeToken(TokenType.STRING, [TokenType.NUMERIC]);
        basicSelector = getIdSelector(keyword, simpleComparatorType, valueToken);
    } else if (keyword.Value === KeywordType.CLASS) {
        const valueToken = expression.consumeToken(TokenType.STRING, [TokenType.NUMERIC]);
        basicSelector = getClassSelector(keyword, simpleComparatorType, valueToken);
    } else if (keyword.Value === KeywordType.ATTRIBUTE || keyword.Value === KeywordType.ATTR || keyword.Value === KeywordType.STYLE) {
        let alternateTypes: TokenType[] | null = null;

        if ((keyword.Value === KeywordType.ATTRIBUTE || keyword.Value === KeywordType.ATTR) && keyword.Type === TokenType.FUNCTION) {
            alternateTypes = [TokenType.NUMERIC];
        }

        const valueToken = isValueToken(expression.nextToken()) ? expression.consumeToken(TokenType.STRING, alternateTypes) : undefined;

        basicSelector = getAttributeSelector(keyword, simpleComparatorType, valueToken);
    } else if (keyword.Value === FunctionType.CHILD && keyword.Type === TokenType.FUNCTION) {
        basicSelector = getStructuralPseudoSelector(keyword);
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
function getAttributeSelector(keyword: Token, simpleComparatorType: OperationType, valueToken: Token | undefined): string {
    if (keyword.Value === KeywordType.ATTRIBUTE || keyword.Value === KeywordType.ATTR) {
        if (keyword.Type !== TokenType.FUNCTION && valueToken) {
            return `[${valueToken.Value}]`;
        } else if (keyword.Type === TokenType.FUNCTION && !valueToken) {
            return `[${keyword.Arguments?.[0].Value ?? ''}]`;
        } else if (!valueToken) {
            throw new Error(`Invalid attribute or style selector. Expected a value token, but none was provided.`);
        }
    }

    if (!valueToken) {
        throw new Error(`Invalid attribute or style selector. Expected a value token, but none was provided.`);
    }

    const attributeName = keyword.Type === TokenType.FUNCTION ? (keyword?.Arguments?.[0].Value ?? '') : getAttributeName(keyword);
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

            // TODO: Improve escape character handling
            const hasEscapedStart = valueToken.Value.startsWith(`[${SymbolType.PERCENT}]`);
            const hasEscapedEnd = valueToken.Value.endsWith(`[${SymbolType.PERCENT}]`);

            if (hasEscapedStart || hasEscapedEnd) {
                valueToken.Value = valueToken.Value.slice(hasEscapedStart ? 3 : 0, hasEscapedEnd ? valueToken.Value.length - 3 : undefined);

                if (hasEscapedStart) {
                    valueToken.Value = `%${valueToken.Value}`;
                }

                if (hasEscapedEnd) {
                    valueToken.Value = `${valueToken.Value}%`;
                }
            }

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
 * Generates a structural pseudo-class selector (e.g., `:nth-child`, `:only-child`, `:empty`)
 * based on the provided token and its arguments.
 *
 * The function processes up to two arguments:
 * - The first argument determines the type of selector (e.g., `first`, `last`, `odd`, `even`, etc.).
 * - The second argument refines the nth-child expression if applicable (e.g., a numeric value or expression).
 *
 * @param keyword - The token representing the structural pseudo-class, which includes
 *                  arguments defining its behavior.
 * @returns A string representing the structural pseudo-class selector in CSS format.
 *
 * @throws An error if:
 * - The token has no arguments or invalid arguments.
 * - Unexpected argument types or values are provided.
 * - Arguments fail to correspond to known pseudo-classes or valid nth-child expressions.
 */
function getStructuralPseudoSelector(keyword: Token): string {
    let selector: string | undefined;

    if (!keyword.Arguments || keyword.Arguments.length == 0) {
        throw new Error(`Expected at least 1 argument for ${keyword.Type} of value ${keyword.Value}`);
    }

    let locationKeyword: KeywordType = KeywordType.FIRST;
    let nthExpression: string | undefined;
    const argument_1: Token = keyword.Arguments[0];
    const argument_2: Token | undefined = keyword.Arguments.length > 1 ? keyword.Arguments[1] : undefined;

    /* ------ 1st Argument */
    if (argument_1.Type === TokenType.KEYWORD) {
        if (argument_1.Value === KeywordType.FIRST || argument_1.Value === KeywordType.LAST) {
            locationKeyword = KeywordType[argument_1.Value];
        } else if (argument_1.Value === KeywordType.ODD || argument_1.Value === KeywordType.EVEN) {
            nthExpression = argument_1.Value;
        } else if (argument_1.Value === KeywordType.ONLY) {
            selector = 'only-child';
        } else if (argument_1.Value === KeywordType.EMPTY) {
            selector = 'empty';
        }
    } else if (argument_1.Type === TokenType.EXPRESSION || argument_1.Type === TokenType.NUMERIC) {
        nthExpression = argument_1.Value;
    } else if (argument_1) {
        throw new Error(
            `Expected ${TokenType.KEYWORD}, ${TokenType.EXPRESSION} or ${TokenType.NUMERIC} for ${keyword.Type} ${keyword.Value}, but got ${argument_1.Type} of value ${argument_1.Value}.`
        );
    }

    /* ------ 2nd Argument ------ */
    if (argument_2?.Type === TokenType.KEYWORD) {
        if (argument_2.Value === KeywordType.ODD || argument_2.Value === KeywordType.EVEN) {
            nthExpression = argument_2.Value;
        } else {
            throw new Error(`Expected keyword of type ${KeywordType.ODD} or ${KeywordType.EVEN} for ${keyword.Type} ${keyword.Value}, but got ${argument_2.Value} instead.`);
        }
    } else if (argument_2?.Type === TokenType.EXPRESSION || argument_2?.Type === TokenType.NUMERIC) {
        nthExpression = argument_2.Value;
    } else if (argument_2) {
        throw new Error(
            `Expected ${TokenType.KEYWORD}, ${TokenType.EXPRESSION} or ${TokenType.NUMERIC} for ${keyword.Type} ${keyword.Value}, but got ${argument_2.Type} of value ${argument_2.Value}.`
        );
    }

    if (selector) {
        return `:${selector}`;
    }

    /* ------ Final assembly ------ */
    if (nthExpression) {
        nthExpression = nthExpression.replaceAll(' ', '');
        selector = `nth` + (locationKeyword === KeywordType.FIRST ? '' : `-${KeywordType.LAST.toLowerCase()}`) + `-child(${nthExpression})`;
    } else {
        selector = `${locationKeyword.toLowerCase()}-child`;
    }

    return `:${selector}`;
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

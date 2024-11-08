import { functions, keywords, operators, Regex, tokenSequenceReplaceables } from './constants';
import { Token, TokenType } from './types';

function cleanToken(value: string): string {
    if (value.startsWith("'")) value = value.substring(1);

    if (value.endsWith("'")) value = value.substring(0, value.length - 1);

    return value;
}

function lexer(input: string): Token[] {
    let tokens: Token[] = [];
    let seekPosition = 0;
    const inputLength = input.length;

    /**
     * @returns `true` if the token was added, otherwise, `false`
     */
    function pushRegexToken(match: RegExpMatchArray | null, tokenType: TokenType): boolean {
        if (!match?.[0]) {
            return false;
        }

        tokens.push({ Type: tokenType, Value: cleanToken(match[0]) });
        seekPosition += match[0].length;

        return true;
    }

    /**
     * @returns `true` if the token was consumed, otherwise, `false`
     */
    function consumeRegexToken(match: RegExpMatchArray | null): boolean {
        if (!match?.[0]) {
            return false;
        }

        seekPosition += match[0].length;

        return true;
    }

    while (seekPosition < inputLength) {
        const rawToken = input.substring(seekPosition);

        /* ------ Misc. Regex matchers ------ */

        if (consumeRegexToken(rawToken.match(Regex.whitespace))) {
            // Not going to use whitespace for validation
            continue;
        }

        if (pushRegexToken(rawToken.match(Regex.comment), TokenType.COMMENT)) {
            continue;
        }

        if (pushRegexToken(rawToken.match(Regex.string), TokenType.STRING)) {
            continue;
        }

        if (pushRegexToken(rawToken.match(Regex.numeric), TokenType.NUMERIC)) {
            continue;
        }

        if (pushRegexToken(rawToken.match(Regex.symbol), TokenType.SYMBOL)) {
            continue;
        }

        /* ------ Functions ------ */

        let match = rawToken.match(Regex.function);

        if (match?.[0]) {
            const matchValue = match[0];
            const indexOf_LPAREN = matchValue.indexOf('(');
            const functionName = matchValue.substring(0, indexOf_LPAREN).toUpperCase();

            if (functions[functionName] == TokenType.FUNCTION) {
                let $function = matchValue.substring(indexOf_LPAREN).replace('(', '').replace(')', '');

                tokens.push({
                    Type: TokenType.FUNCTION,
                    Value: functionName,
                    Arguments: tokenizeArguments($function),
                });

                seekPosition += matchValue.length;
                continue;
            }
        }

        /* ------ Operators ------ */

        let operatorFound = false;

        for (const key in operators) {
            if (rawToken.startsWith(key + ' ')) {
                // Must have a space after it. Otherwise `<` can parse on a `<>`. *Should actually do a forward seek instead... or largest match wins?.
                tokens.push({ Type: operators[key], Value: key });

                seekPosition += key.length;
                operatorFound = true;

                break;
            }
        }

        if (operatorFound) {
            continue;
        }

        /* ------ Keywords & Identifiers */

        match = rawToken.match(Regex.identifier);

        if (match?.[0]) {
            let tokenType = TokenType.IDENTIFIER;
            let matchValue = match?.[0].toUpperCase() ?? '';

            if (keywords[matchValue] == TokenType.KEYWORD) {
                tokenType = TokenType.KEYWORD;
            }

            tokens.push({ Type: tokenType, Value: matchValue.trim() });
            seekPosition += match[0].length;
            continue;
        }

        /* ------ No match found ------ */

        tokens.push({ Type: TokenType.UNKNOWN, Value: rawToken[0] });
        seekPosition++;
    }

    tokens = replaceTokenGroupings(tokens);

    return tokens;
}

function tokenizeArguments(value: string): string[] {
    let $arguments: string[] = [];
    let seekPosition = 0;

    function consumeArgument(match: RegExpMatchArray | null): boolean {
        if (!match?.[0]) {
            return false;
        }

        $arguments.push(cleanToken(match?.[0]));
        seekPosition += match?.[0].length;

        return true;
    }

    while (seekPosition < value.length) {
        /* ------ Whitespace ------ */
        let match = value.match(Regex.whitespace);

        if (match?.[0]) {
            seekPosition += match?.[0].length;
        }

        /* ------ String ------ */
        if (consumeArgument(value.match(Regex.string))) {
            continue;
        }

        /* ------ Numeric ------ */
        if (consumeArgument(value.match(Regex.numeric))) {
            continue;
        }

        seekPosition++; // Will handle any commas and misc. wandering characters. Stricter validation should be put in place.
    }

    return $arguments;
}

/**
 * Replaces token groupings with their respective token.
 *
 * #### Example: `CHILD`, `OF` comes in as two operator tokens, but should be replaced with a single `CHILD OF` operator token.
 *
 * @param tokens - The tokens to be evaluated.
 * @returns The tokens with the groupings replaced.
 */
function replaceTokenGroupings(tokens: Token[]): Token[] {
    for (let i = 0; i < tokens.length; i++) {
        let tokensCnt = tokens.length;

        if (i >= tokensCnt + 1 || (i < tokensCnt + 1 && (tokens[i].Type != TokenType.OPERATOR || tokens[i + 1].Type != TokenType.OPERATOR))) {
            continue;
        }

        let replacedTokens: Token[] = [];

        for (const key in tokenSequenceReplaceables) {
            const _operators = tokenSequenceReplaceables[key];

            for (let x = 0; x < _operators.length; x++) {
                const nextTokenIdx = i + x;

                if (nextTokenIdx >= tokensCnt || _operators[x] != tokens[nextTokenIdx].Value) {
                    replacedTokens = [];
                    break;
                }

                replacedTokens.push(tokens[nextTokenIdx]);
            }

            if (replacedTokens.length > 0) {
                const newToken: Token = {
                    ...tokens[i],
                    Value: key,
                };

                tokens.splice(i, replacedTokens.length, newToken);

                break;
            }
        }
    }

    return tokens;
}

export { lexer };

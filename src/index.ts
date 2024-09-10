import './style.css';

import { lexer } from './lexer';
import { parser } from './parser';

export function query(sql: string) {
    const lexerTokens = lexer(sql);
    const querySelector = parser(lexerTokens);

    return querySelector;
}

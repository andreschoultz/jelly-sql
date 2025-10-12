import { describe, expect, it } from 'vitest';

import { lexer } from '../../src/lexer';
import { parser } from '../../src/parser';

describe('Enhanced Nested Logical Grouping', () => {
    describe('Basic Nested Expressions', () => {
        it('should handle simple nested OR within AND', () => {
            const input = `SELECT * FROM DOM WHERE TAG = 'a' AND (CLASS = 'active' OR CLASS = 'hover')`;
            const tokens = lexer(input);
            const result = parser(tokens);

            expect(result).toBe('a.active, a.hover');
        });

        it('should handle nested AND within OR', () => {
            const input = `SELECT * FROM DOM WHERE CLASS = 'button' OR (TAG = 'span' AND CLASS = 'icon')`;
            const tokens = lexer(input);
            const result = parser(tokens);

            expect(result).toBe('.button, span.icon');
        });

        it('should handle double nested expressions (the key enhancement)', () => {
            const input = `SELECT * FROM DOM WHERE TAG = 'a' AND (CLASS = 'active' OR (CLASS = 'link' AND ID = 'new-link'))`;
            const tokens = lexer(input);
            const result = parser(tokens);

            expect(result).toBe('a.active, a#new-link.link');
        });
    });

    describe('Advanced Nested Expressions', () => {
        it('should handle triple nested expressions', () => {
            const input = `SELECT * FROM DOM WHERE TAG = 'div' AND (CLASS = 'container' OR (CLASS = 'wrapper' AND (ID = 'main' OR ID = 'sidebar')))`;
            const tokens = lexer(input);
            const result = parser(tokens);

            expect(result).toContain('div.container');
            expect(result).toContain('div#main.wrapper');
            expect(result).toContain('div#sidebar');
        });

        it('should handle nested expressions with attributes', () => {
            const input = `SELECT * FROM DOM WHERE TAG = 'input' AND (ATTR('type') = 'text' OR (ATTR('type') = 'email' AND CLASS = 'validated'))`;
            const tokens = lexer(input);
            const result = parser(tokens);

            expect(result).toBe('input[type="text"], input.validated[type="email"]');
        });

        it('should handle complex nested grouping from documentation', () => {
            const input = `SELECT * FROM DOM WHERE TAG = 'nav' AND (CLASS = 'main-menu' OR (CLASS = 'mobile-menu' AND ATTR('data-mobile') = 'true'))`;
            const tokens = lexer(input);
            const result = parser(tokens);

            expect(result).toBe('nav.main-menu, nav.mobile-menu[data-mobile="true"]');
        });
    });

    describe('Edge Cases and Validation', () => {
        it('should handle unbalanced parentheses gracefully', () => {
            const input = `SELECT * FROM DOM WHERE TAG = 'div' AND (CLASS = 'test'`;
            const tokens = lexer(input);

            expect(() => parser(tokens)).not.toThrow();
        });

        it('should handle empty expressions', () => {
            const input = `SELECT * FROM DOM WHERE TAG = 'div' OR CLASS = 'test'`;
            const tokens = lexer(input);
            const result = parser(tokens);

            expect(result).toBe('div, .test');
        });

        it('should handle nested parentheses with numeric values', () => {
            const input = `SELECT * FROM DOM WHERE TAG = 'div' AND (CHILD(1) OR (CHILD(2) AND CLASS = 'special'))`;
            const tokens = lexer(input);
            const result = parser(tokens);

            expect(result).toBe('div:nth-child(1), div:nth-child(2).special');
        });
    });

    describe('Backward Compatibility', () => {
        it('should maintain existing functionality for simple cases', () => {
            const input = `SELECT * FROM DOM WHERE TAG = 'div' AND CLASS = 'container'`;
            const tokens = lexer(input);
            const result = parser(tokens);

            expect(result).toBe('div.container');
        });

        it('should handle OR without parentheses correctly', () => {
            const input = `SELECT * FROM DOM WHERE TAG = 'div' OR CLASS = 'container'`;
            const tokens = lexer(input);
            const result = parser(tokens);

            expect(result).toBe('div, .container');
        });

        it('should handle mixed AND/OR operators correctly', () => {
            const input = `SELECT * FROM DOM WHERE TAG = 'a' AND CLASS = 'active' OR CLASS = 'link' OR TAG = 'button' AND ID = 'to-top-link'`;
            const tokens = lexer(input);
            const result = parser(tokens);

            expect(result).toBe('a.active, .link, button#to-top-link');
        });
    });

    describe('Real-world Use Cases', () => {
        it('should handle navigation menu scenarios', () => {
            const input = `SELECT * FROM DOM WHERE TAG = 'nav' AND (CLASS = 'primary' OR (CLASS = 'secondary' AND ATTR('role') = 'navigation'))`;
            const tokens = lexer(input);
            const result = parser(tokens);

            expect(result).toBe('nav.primary, nav.secondary[role="navigation"]');
        });

        it('should handle button group scenarios', () => {
            const input = `SELECT * FROM DOM WHERE TAG = 'button' AND (CLASS = 'submit' OR (CLASS = 'cancel' AND ATTR('disabled') != 'true'))`;
            const tokens = lexer(input);
            const result = parser(tokens);

            expect(result).toBe('button.submit, button.cancel:not([disabled="true"])');
        });

        it('should handle form field scenarios', () => {
            const input = `SELECT * FROM DOM WHERE TAG = 'input' AND (ATTR('type') = 'email' OR (ATTR('type') = 'text' AND CLASS = 'required'))`;
            const tokens = lexer(input);
            const result = parser(tokens);

            expect(result).toBe('input[type="email"], input.required[type="text"]');
        });

        it('should handle card layout scenarios', () => {
            const input = `SELECT * FROM DOM WHERE CLASS = 'card' AND (CLASS = 'featured' OR (TAG = 'article' AND ATTR('data-priority') = 'high'))`;
            const tokens = lexer(input);
            const result = parser(tokens);

            expect(result).toBe('.card.featured, article.card[data-priority="high"]');
        });
    });
});

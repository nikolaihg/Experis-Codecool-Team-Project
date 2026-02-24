import { describe, it, expect } from 'vitest';

describe('Sanity Check', () => {
    it('should be true', () => {
        expect(true).toBe(true);
    });

    it('should be able to add numbers', () => {
        expect(1 + 1).toBe(2);
    });
});

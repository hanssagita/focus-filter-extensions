import { describe, it, expect } from 'vitest';
import { hashPassword } from '../lib/storage';

describe('hashPassword', () => {
    it('should correctly hash a string using SHA-256', async () => {
        const password = 'mySecretPassword123';
        const hash = await hashPassword(password);
        
        // Expected SHA-256 hash for 'mySecretPassword123'
        const expected = '1e28d0fd01d085787843952a78c58861a8f82492063bfbf57ee6f3224e75bd3e';
        expect(hash).toBe(expected);
    });

    it('should return different hashes for different strings', async () => {
        const hash1 = await hashPassword('pass1');
        const hash2 = await hashPassword('pass2');
        expect(hash1).not.toBe(hash2);
    });
});

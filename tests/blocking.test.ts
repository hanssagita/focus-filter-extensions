import { describe, it, expect } from 'vitest';
import { isUrlBlocked } from '../lib/blocking';

describe('isUrlBlocked', () => {
    describe('when blocking is disabled', () => {
        it('should not block any URL', () => {
            const url = 'https://www.instagram.com';
            const blockedSites = ['instagram'];
            const enabled = false;

            expect(isUrlBlocked(url, blockedSites, enabled)).toBe(false);
        });
    });

    describe('when blocking is enabled', () => {
        it('should block URL containing exact keyword', () => {
            const url = 'https://www.instagram.com';
            const blockedSites = ['instagram'];
            const enabled = true;

            expect(isUrlBlocked(url, blockedSites, enabled)).toBe(true);
        });

        it('should block URL with subdomain containing keyword', () => {
            const url = 'https://m.instagram.com/explore';
            const blockedSites = ['instagram'];
            const enabled = true;

            expect(isUrlBlocked(url, blockedSites, enabled)).toBe(true);
        });

        it('should block URL with different TLD containing keyword', () => {
            const url = 'https://instagram.net';
            const blockedSites = ['instagram'];
            const enabled = true;

            expect(isUrlBlocked(url, blockedSites, enabled)).toBe(true);
        });

        it('should not block URL without keyword', () => {
            const url = 'https://www.google.com';
            const blockedSites = ['instagram'];
            const enabled = true;

            expect(isUrlBlocked(url, blockedSites, enabled)).toBe(false);
        });

        it('should be case-insensitive', () => {
            const url = 'https://www.INSTAGRAM.COM';
            const blockedSites = ['instagram'];
            const enabled = true;

            expect(isUrlBlocked(url, blockedSites, enabled)).toBe(true);
        });

        it('should handle multiple blocked keywords', () => {
            const url = 'https://www.facebook.com';
            const blockedSites = ['instagram', 'facebook', 'twitter'];
            const enabled = true;

            expect(isUrlBlocked(url, blockedSites, enabled)).toBe(true);
        });

        it('should not block when none of the keywords match', () => {
            const url = 'https://www.github.com';
            const blockedSites = ['instagram', 'facebook', 'twitter'];
            const enabled = true;

            expect(isUrlBlocked(url, blockedSites, enabled)).toBe(false);
        });

        it('should handle empty blocked sites list', () => {
            const url = 'https://www.instagram.com';
            const blockedSites: string[] = [];
            const enabled = true;

            expect(isUrlBlocked(url, blockedSites, enabled)).toBe(false);
        });

        it('should ignore whitespace in keywords', () => {
            const url = 'https://www.instagram.com';
            const blockedSites = ['  instagram  '];
            const enabled = true;

            expect(isUrlBlocked(url, blockedSites, enabled)).toBe(true);
        });

        it('should handle partial domain matches', () => {
            const url = 'https://www.myinstagramphotos.com';
            const blockedSites = ['instagram'];
            const enabled = true;

            expect(isUrlBlocked(url, blockedSites, enabled)).toBe(true);
        });

        it('should block query parameters containing keyword', () => {
            const url = 'https://www.example.com?redirect=instagram.com';
            const blockedSites = ['instagram'];
            const enabled = true;

            expect(isUrlBlocked(url, blockedSites, enabled)).toBe(true);
        });
    });
});

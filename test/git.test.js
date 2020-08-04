let GitHub = require('../src/lib/GitHub');

test('performRestApiRequest should fail without token', async () => {
    global.app = {
        config: {}
    }
    try {
        await GitHub.performRestApiRequest();
    } catch (e) {
        expect(e.message).toBe('Token is missing from the configuration')
    }
});

test('performRestApiRequest should fail without a username', async () => {
    global.app = {
        config: {
            token: 'some token'
        }
    }
    try {
        await GitHub.performRestApiRequest();
    } catch (e) {
        expect(e.message).toBe('Username is missing from the configuration')
    }
});

test('performRestApiRequest should fail without a URL', async () => {
    global.app = {
        config: {
            token: 'some token',
            username: 'some username'
        }
    }
    try {
        await GitHub.performRestApiRequest();
    } catch (e) {
        expect(e.message).toBe('No URL provided for the API request')
    }
});

test('performGraphQlApiRequest should fail without a token', async () => {
    global.app = {
        config: {}
    }
    try {
        await GitHub.performGraphQlApiRequest({});
    } catch (e) {
        expect(e.message).toBe('Token is missing from the configuration')
    }
});

test('performGraphQlApiRequest should fail without a username', async () => {
    global.app = {
        config: {
            token: 'some token'
        }
    }
    try {
        await GitHub.performGraphQlApiRequest({});
    } catch (e) {
        expect(e.message).toBe('No query was provided for the API request');
    }
});
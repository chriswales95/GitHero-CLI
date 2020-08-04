"use strict";

let {Command, GetReposCommand, GetIssuesCommand, GetPrsCommand, GetGistsCommand, GetNotificationsCommand, GetRepositorySummaryCommand} = require("../src/lib/Command");

global.app = {
    args: {
        num: 10,
        url: 'https://github.com/chriswales95/GitHero-CLI'
    },
    config: {}
};

it('Command execute function should not be able to be run', function () {
    try {
        let command = new Command();
    } catch (e) {
        expect(e.message).toBe('Cannot instantiate abstract class');
    }
});

it('GetGistsCommand should fail without token', () => {
    try {
        let command = new GetGistsCommand();
        command.execute();
    } catch (e) {
        expect(e.message).toBe('Token is missing from the configuration')
    }

});

it('GetIssuesCommand should fail without token', () => {
    try {
        let command = new GetIssuesCommand();
        command.execute();
    } catch (e) {
        expect(e.message).toBe('Token is missing from the configuration')
    }
});

it('GetReposCommand should fail without token', () => {
    try {
        let command = new GetReposCommand();
        command.execute();
    } catch (e) {
        expect(e.message).toBe('Token is missing from the configuration')
    }
});

it('GetNotificationsCommand should fail without token', () => {
    try {
        let command = new GetNotificationsCommand();
        command.execute();
    } catch (e) {
        expect(e.message).toBe('Token is missing from the configuration')
    }
});

it('GetRepositorySummaryCommand should fail without token', async () => {
    try {
        let command = new GetRepositorySummaryCommand();
        await command.execute();
    } catch (e) {
        expect(e.message).toBe('Token is missing from the configuration')
    }
});

it('GetPrsCommand should fail without token', async () => {
    let command = new GetPrsCommand();
    let result = await command.execute();
    expect(result.message).toBe('Token is missing from the configuration')
});
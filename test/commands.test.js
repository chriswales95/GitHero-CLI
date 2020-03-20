"use strict";

let {GetReposCommand, GetIssuesCommand, GetPrsCommand, GetGistsCommand} = require("../src/Command");

global.app = {
    args: {
        num: 10
    }
};

it('GetReposCommand should fail', async () => {
    let command = new GetReposCommand();
    await expect(command.execute())
        .rejects
        .toThrow();
});

it('GetGistsCommand should fail', async () => {
    let command = new GetGistsCommand();
    await expect(command.execute())
        .rejects
        .toThrow();
});

it('GetIssuesCommand should fail', async () => {
    let command = new GetIssuesCommand();
    await expect(command.execute())
        .rejects
        .toThrow();
});

it('GetReposCommand should fail', async () => {
    let command = new GetPrsCommand();
    await expect(command.execute())
        .rejects
        .toThrow();
});
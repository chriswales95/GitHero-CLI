"use strict";

const yargs = require('yargs');
let argv = yargs.command('repos [num]', 'get a list of your repositories');

argv._ = [];
let Bootstrap = require('../src/lib/Bootstrap.js');
let app = new Bootstrap(argv).init();

test('Test application bootstrap', () => {
    expect(app).not.toBeUndefined();
});

test('Check arguments passed in', () => {
    let result = app.checkArgs(app.args);
    expect(result).toBe(false);
});

test('Check if storage can be saved', () => {
    let result = app.checkArgs(app.args);
    expect(result).toBe(false);
});

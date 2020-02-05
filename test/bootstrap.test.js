"use strict";

const yargs = require('yargs');
let argv = yargs.command('repos [num]', 'get a list of your repositories');

test('Test application bootstrap', () => {

    argv._ = [];
    let Bootstrap = require('../src/Bootstrap.js');
    let app = new Bootstrap(argv).init();

    expect(app).not.toBeUndefined();
});
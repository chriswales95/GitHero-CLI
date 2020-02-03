#!/usr/bin/env node

/**
 * GitHero CLI
 *
 * Christopher Wales
 */

"use strict";

const yargonaut = require('yargonaut');
const yargs = require('yargs');
const bootstrap = require('./Bootstrap.js');

yargonaut.style('green');

/**
 * @todo fix this so arguments work correctly
 */
let argv = yargs
    .command(
        'config',
        'Configure githero',
        function (yargs) {
            return yargs.option('token', {
                alias: 't',
                describe: 'Store your api key for ease of use',
                type: 'string'
            })
        }
    )
    .command('repos <num> <first> <last>', 'get a list of your repositories')
    .command('gists <num> <first> <last>', 'get a list of your gists')
    .help()
    .argv;

if (argv._.length === 0)
    yargs.showHelp();

let app = new bootstrap(argv).init();

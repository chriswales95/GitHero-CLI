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
        })
    .command('repos [num]', 'get a list of your repositories')
    .command('gists [num]', 'get a list of your gists')
    .help()
    .argv;


let app = new bootstrap(argv).init();

/**
 * Process Arguments
 */
(() => {
    if (argv._.length === 0) {
        yargs.showHelp();
        return;
    }

    let Git = require('./Git');
    let git = new Git();

    if (app.args._.includes('repos')) {
        git.getRepos(app.args.num ? app.args.num : 10, app.config.token)
            .then(res => {
                console.table(res, ['name', 'sshUrl', 'updatedAt'])
            });
    }

    if (app.args._.includes('gists')) {
        git.getGists(app.args.num ? app.args.num : 10, app.config.token)
            .then((res) => {
                console.table(res, ['description', 'url'])
            });
    }
})();

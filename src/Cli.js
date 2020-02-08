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
            return [
                yargs.option('token', {
                    alias: 't',
                    describe: 'Store your api key for ease of use',
                    type: 'string'
                })]
        })
    .command('repos [num]', 'get a list of your repositories')
    .command('gists [num]', 'get a list of your gists')
    .command('issues <account> <repository> [num]', 'get issues from a repository')
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

    if (argv._.length > 1) {
        console.error("Only one command at a time");
        yargs.showHelp();
        return;
    }

    let Git = require('./Git');
    let git = new Git();

    if (app.args._.includes('issues')) {
        git.getIssuesFromRepo(app.args.account, app.args.repository, app.args.num ? app.args.num : 10, app.config.token)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.error(err);
            });
    }

    if (app.args._.includes('repos')) {
        git.getRepos(app.args.num ? app.args.num : 10, app.config.token)
            .then(res => {
                console.table(res, ['name', 'sshUrl', 'updatedAt'])
            })
            .catch(err => {
                console.error(err);
            });
    }

    if (app.args._.includes('gists')) {
        git.getGists(app.args.num ? app.args.num : 10, app.config.token)
            .then((res) => {
                console.table(res, ['description', 'url'])
            })
            .catch(err => {
                console.error(err);
            });
    }
})();

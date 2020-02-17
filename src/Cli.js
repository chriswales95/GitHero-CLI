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

const commands = {
    repos: "repos",
    gists: "gists",
    issues: "issues",
    prs: "prs"
};

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
    .command('prs <account> <repository> [num]', 'get pull requests from a repository')
    .help()
    .argv;

let app = new bootstrap(argv).init();

/**
 * Process Arguments
 */
(() => {

    if (argv._.length > 1) {
        console.error("Only enter one command at a time");
        yargs.showHelp();
        return;
    }

    let GitHub = require('./GitHub');
    let gh = new GitHub(app.config.token);

    switch (app.args._[0]) {
        case commands.issues:
            gh.getIssuesFromRepo(app.args.account, app.args.repository, app.args.num ? app.args.num : 10)
                .then(res => {
                    console.log(res);
                })
                .catch(err => {
                    console.error(err);
                });
            break;

        case commands.repos:
            gh.getRepos(app.args.num ? app.args.num : 10)
                .then(res => {
                    console.table(res, ['name', 'sshUrl', 'updatedAt'])
                })
                .catch(err => {
                    console.error(err);
                });
            break;

        case commands.gists:
            gh.getGists(app.args.num ? app.args.num : 10)
                .then((res) => {
                    console.table(res, ['description', 'url'])
                })
                .catch(err => {
                    console.error(err);
                });
            break;

        case commands.prs:
            gh.getPullRequests(app.args.account, app.args.repository, app.args.num ? app.args.num : 10)
                .then(res => {
                    console.table(res);
                })
                .catch(err => {
                    console.error(err);
                });
            break;

        default:
            yargs.showHelp();
    }
})();

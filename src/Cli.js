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

yargonaut.style('cyan');

const commands = {
    repos: "repos",
    gists: "gists",
    issues: "issues",
    prs: "prs"
};

function outputResults(columnHeadings, data) {
    let chalk = require("chalk");
    let {table} = require('table');

    let config = {
        border: {
            topBody: `─`,
            topJoin: `┬`,
            topLeft: `┌`,
            topRight: `┐`,
            bottomBody: `─`,
            bottomJoin: `┴`,
            bottomLeft: `└`,
            bottomRight: `┘`,
            bodyLeft: `│`,
            bodyRight: `│`,
            bodyJoin: `│`,
            joinBody: `─`,
            joinLeft: `├`,
            joinRight: `┤`,
            joinJoin: `┼`
        }
    };

    let cols = columnHeadings.map(e => {
        return chalk.cyan.bold(e);
    });

    let output = [];
    output.push(cols);

    data.forEach(item => {
        let row = [];
        for (let i = 0; i < columnHeadings.length; i++) {
            row.push(item[columnHeadings[i]]);
        }
        output.push(row)
    });


    console.log(table(output, config));
}

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

/**
 * Global app
 * @type {Bootstrap}
 */
let application = new bootstrap(argv).init();
global.app = application;

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
            let {GetIssuesCommand} = require('./Command');
            let issues = new GetIssuesCommand().execute();


            issues.then(result => {
                result.forEach(res => {
                    res.authorName = res.author.login;
                });
                outputResults(["title", "authorName", "createdAt"], result);
            });
            break;

        case commands.repos:
            let {GetReposCommand} = require('./Command');
            let repos = new GetReposCommand().execute();

            repos.then(result => {
                outputResults(["name", "sshUrl", "updatedAt"], result);
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

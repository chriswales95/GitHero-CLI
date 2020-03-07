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
    let {table, getBorderCharacters} = require('table');

    let config = {
        border: app.args.b === true ? getBorderCharacters('void') : getBorderCharacters('ramac')
    };

    let cols = columnHeadings.map(e => {
        return chalk.cyan.bold(e);
    });

    let output = [];
    output.push(cols);

    if (app.args.raw) {
        console.log(data);
        return;
    }

    data.forEach(item => {
        let row = [];
        for (let i = 0; i < columnHeadings.length; i++) {
            row.push(item[columnHeadings[i]]);
        }
        output.push(row)
    });

    console.log(table(output, config));
}

const borderlessOption = ["borderless", {
    alias: 'b',
    type: 'boolean',
    description: 'Output with no borders'
}];

const rawOption = ["raw", {
    type: 'boolean',
    description: 'Output raw JSON from GitHub'
}];

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
    .command('gists [num]', 'get a list of your gists', () => {
        return [yargs.option(...borderlessOption), yargs.option(...rawOption)]
    })
    .command('repos [num]', 'get a list of your repositories', () => {
        return [yargs.option(...borderlessOption), yargs.option(...rawOption)]
    })
    .command('issues <account> <repository> [num]', 'get issues from a repository', () => {
        return [yargs.option(...borderlessOption), yargs.option(...rawOption)]
    })
    .command('prs <account> <repository> [num]', 'get pull requests from a repository', () => {
        return [yargs.option(...borderlessOption), yargs.option(...rawOption)]
    })
    .help()
    .argv;

/**
 * Global app
 * @type {Bootstrap}
 */
global.app = new bootstrap(argv).init();

/**
 * Process Arguments
 */
(() => {

    if (argv._.length > 1) {
        console.error("Only enter one command at a time");
        yargs.showHelp();
        return;
    }

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
            let {GetGistsCommand} = require('./Command');
            let gists = new GetGistsCommand().execute();

            gists.then(result => {
                outputResults(["description", "url", "isPublic"], result);
            });
            break;

        case commands.prs:
            let {GetPrsCommand} = require('./Command');
            let prs = new GetPrsCommand().execute();

            prs.then(result => {
                result.nodes.forEach(res => {
                    res.authorName = res.node.author ? res.node.author.login : "none";
                    res.state = res.node.state.toLowerCase();
                    res.title = res.node.title;
                });
                outputResults(["title", "authorName", "state"], result.nodes);
            });
            break;

        default:
            yargs.showHelp();
    }
})();

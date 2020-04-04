#!/usr/bin/env node

/**
 * GitHero CLI
 *
 * @author Christopher Wales
 */

"use strict";

const yargonaut = require('yargonaut');
const yargs = require('yargs');
const bootstrap = require('./Bootstrap.js');

yargonaut.style('cyan');

/**
 * Key value pair for commands
 *
 * @type {Object}
 */
const commands = {
    repos: "repos",
    gists: "gists",
    issues: "issues",
    prs: "prs",
    notifications: "notifications"
};

/**
 * @description output results to console
 *
 * @param columnHeadings {Array<string>} column headings
 * @param data {Object} data object
 */
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
        console.log(JSON.stringify(data));
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

/**
 * option passed in to specify borderless data output
 */
const borderlessOption = ["borderless", {
    alias: 'b',
    type: 'boolean',
    description: 'Output with no borders'
}];

/**
 * option passed in to specify raw data output
 */
const rawOption = ["raw", {
    type: 'boolean',
    description: 'Output raw JSON from GitHub'
}];

/**
 *
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
                }),
                yargs.option('username', {
                    alias: 'u',
                    describe: 'Store your username',
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
    .command('notifications', 'Display your unread notifications', () => {
        return [yargs.option(...borderlessOption), yargs.option(...rawOption)]
    })
    .help()
    .argv;

/**
 * @description Global application object
 *
 * @global
 * @type {Bootstrap}
 */
global.app = new bootstrap(argv).init();

/**
 * Process Arguments
 */
function processArgs() {

    if (argv._.length > 1 && app) {
        console.error("Only enter one command at a time");
        yargs.showHelp();
        return;
    }

    switch (app.args._[0]) {
        case commands.issues:
            let {GetIssuesCommand} = require('./Command');
            let issues = new GetIssuesCommand().execute();

            issues.then(result => {
                result.nodes.forEach(res => {
                    res.authorName = res.node.author ? res.node.author.login : "none";
                    res.title = res.node.title;
                    res.createdAt = res.node.createdAt;
                });
                outputResults(["title", "authorName", "createdAt"], result.nodes);
            });
            break;

        case commands.repos:
            let {GetReposCommand} = require('./Command');
            let repos = new GetReposCommand().execute();

            repos.then(result => {
                result.nodes.forEach(res => {
                    res.name = res.node.name;
                    res.sshUrl = res.node.sshUrl;
                    res.updatedAt = res.node.updatedAt;
                });
                outputResults(["name", "sshUrl", "updatedAt"], result.nodes);
            });
            break;

        case commands.gists:
            let {GetGistsCommand} = require('./Command');
            let gists = new GetGistsCommand().execute();

            gists.then(result => {
                result.nodes.forEach(res => {
                    res.description = res.node.description;
                    res.url = res.node.url;
                    res.isPublic = res.node.isPublic;
                });
                outputResults(["description", "url", "isPublic"], result.nodes);
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

        case commands.notifications:
            let {GetNotificationsCommand} = require('./Command');
            let notifications = new GetNotificationsCommand().execute();

            notifications.then(result => {
                if (result.data.length === 0) {
                    console.log("No notifications! 🎉");
                    return;
                }
                result.data.forEach(notification => {
                    notification.title = notification.subject.title;
                    notification.url = notification.subject.url;
                    notification.repo = notification.repository.full_name;
                });
                outputResults(["repo", "title", "url"], result.data);
            });
            break;

        default:
            yargs.showHelp();
    }
}

// Disable this bit when running tests
if (!global.test)
    processArgs();

module.exports = {outputResults, processArgs};

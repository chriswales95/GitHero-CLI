#!/usr/bin/env node

/**
 * GitHero CLI
 *
 * @author Christopher Wales
 */

"use strict";

const yargonaut = require('yargonaut');
const yargs = require('yargs');
const bootstrap = require('./lib/Bootstrap.js');
const command = require('./lib/Command');

yargonaut.style('cyan');

/**
 * Key value pair for commands
 *
 * @type {Object} a key pair value of command names
 */
const commands = {
    repos: "repos",
    gists: "gists",
    issues: "issues",
    prs: "prs",
    notifications: "notifications",
    rs: "rs"
};

/**
 * @description output results to console
 *
 * @param options {Object} options
 * @param data {Object} data object
 */
function outputResults(options, data) {
    let chalk = require("chalk");
    let {table, getBorderCharacters} = require('table');

    let config = {
        border: getBorderCharacters('ramac')
    };

    let output = [];
    if (options.usingColumnHeadings !== true) {

        let cols = options.rowHeadings.map(e => {
            return chalk.cyan.bold(e);
        });

        output.push(cols);

        data.forEach(item => {
            let row = [];
            for (let i = 0; i < options.rowHeadings.length; i++) {
                row.push(item[options.rowHeadings[i]]);
            }
            output.push(row)
        });
    } else {
        data.forEach(item => {
            for (let [key, val] of Object.entries(item)) {
                output.push([chalk.cyan.bold(key), val]);
            }
        });
    }

    /**
     * Allowed formats: csv, json, borderless
     */
    if (app.args.format) {
        switch (app.args.format) {
            case "json":
                console.log(JSON.stringify(data));
                return;
            case "csv":
                if (options.usingColumnHeadings !== true) {
                    console.log(options.rowHeadings.join(','));
                    output.splice(0, 1); // get rid of the headings with the formatting
                }
                output.forEach(row => {
                    console.log(row.join(','))
                });
                return;
            case "borderless":
                config.border = getBorderCharacters('void');
                break;
            default:
                console.error(chalk.red("Format parameter doesn't match the allowed format types!"));
                return;
        }
    }
    console.log(table(output, config));
}

/**
 * option passed in to specify data output
 */
const formatOption = ["format", {
    type: 'string',
    description: 'Change the formatted output to a supported format. Accepted formats: borderless, json, csv'
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
                }),
                yargs.option('username', {
                    alias: 'u',
                    describe: 'Store your username',
                    type: 'string'
                })]
        })
    .command('gists [num]', 'get a list of your gists', () => {
        return [yargs.option(...formatOption)]
    })
    .command('repos [num]', 'get a list of your repositories', () => {
        return [yargs.option(...formatOption)]
    })
    .command('issues <url> [num]', 'get issues from a repository', () => {
        return [yargs.option(...formatOption)]
    })
    .command('prs <url> [num]', 'get pull requests from a repository', () => {
        return [yargs.option(...formatOption)]
    })
    .command('notifications', 'Display your unread notifications', () => {
        return [yargs.option(...formatOption)]
    })
    .command('rs <url>', 'Display a summary about a repository', () => {
        return [yargs.option(...formatOption)]
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

    if (app.args._.length > 1 && app) {
        throw new Error("Only enter one command at a time");
    }

    if (app.config) {
        if (!(app.config.token)) {
            console.error("\nHold on!\n\nTo continue, you'll need to provide GitHero with an API key from Github! We can't do anything otherwise ¯\\_(ツ)_/¯");
            console.error("https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line");
            process.exit(1);
        }
    }

    switch (app.args._[0]) {
        case commands.issues:
            let issues = new command.GetIssuesCommand().execute();

            issues.then(result => {
                if (result instanceof Error) {
                    console.error(result.message);
                    process.exit(1);
                }
                result.nodes.forEach(res => {
                    res.authorName = res.node.author ? res.node.author.login : "none";
                    res.title = res.node.title;
                    res.createdAt = new Date(res.node.createdAt).toUTCString();
                });
                outputResults({rowHeadings: ["title", "authorName", "createdAt"]}, result.nodes);
            });
            break;

        case commands.repos:
            let repos = new command.GetReposCommand().execute();

            repos.then(result => {
                if (result instanceof Error) {
                    console.error(result.message);
                    process.exit(1);
                }
                result.nodes.forEach(res => {
                    res.name = res.node.name;
                    res.sshUrl = res.node.sshUrl;
                    res.updatedAt = new Date(res.node.updatedAt).toUTCString();
                });
                outputResults({rowHeadings: ["name", "sshUrl", "updatedAt"]}, result.nodes);
            });
            break;

        case commands.gists:
            let gists = new command.GetGistsCommand().execute();

            gists.then(result => {
                if (result instanceof Error) {
                    console.error(result.message);
                    process.exit(1);
                }
                let nodes = result.nodes;
                nodes.forEach(res => {
                    res.description = res.node.description;
                    res.url = res.node.url;
                    res.isPublic = res.node.isPublic;
                });
                outputResults({rowHeadings: ["description", "url", "isPublic"]}, result.nodes);
            });
            break;

        case commands.prs:
            let prs = new command.GetPrsCommand().execute();

            prs.then(result => {
                if (result instanceof Error) {
                    console.error(result.message);
                    process.exit(1);
                }

                let nodes = result.nodes;
                nodes.forEach(res => {
                    res.authorName = res.node.author ? res.node.author.login : "none";
                    res.state = res.node.state.toLowerCase();
                    res.title = res.node.title;
                });
                outputResults({rowHeadings: ["title", "authorName", "state"]}, nodes);
            });
            break;

        case commands.notifications:
            let notifications = new command.GetNotificationsCommand().execute();

            notifications.then(result => {
                if (result instanceof Error) {
                    console.error(result.message);
                    process.exit(1);
                }
                if (result.data.length === 0) {
                    console.log("No notifications! 🎉");
                    return;
                }
                result.data.forEach(notification => {
                    notification.title = notification.subject.title;
                    notification.url = notification.subject.url;
                    notification.repo = notification.repository.full_name;
                });
                outputResults({rowHeadings: ["repo", "title", "url"]}, result.data);
            });
            break;

        case commands.rs:
            const summary = new command.GetRepositorySummaryCommand().execute();
            summary.then(data => {
                if (data instanceof Error) {
                    console.error(data.message);
                    process.exit(1);
                }
                const summaryData = data.data.data.search.nodes[0];

                if (data.data.data.search.nodes.length === 0) {
                    console.log('There was an error fetching the repository. Did you provide a valid URL?');
                    process.exit(0);
                }

                let tableRows = [];
                // outputResults expects an array so let's give it one
                for (let [key, value] of Object.entries(summaryData)) {

                    if (value !== null && value instanceof String) {
                        if (key === 'pushedAt')
                            value = new Date(value).toUTCString();

                        if (key === 'updatedAt')
                            value = new Date(value).toUTCString();

                        if (key === 'createdAt')
                            value = new Date(value).toUTCString();
                    }

                    if (typeof value === 'object' && value !== null) {
                        if (value.hasOwnProperty('totalCount'))
                            value = value.totalCount ? value.totalCount : 'no data';

                        if (value.hasOwnProperty('nickname'))
                            value = value.nickname ? value.nickname : 'no data';
                    }

                    if (value == null || value === '')
                        value = 'no data';

                    tableRows.push({[key]: value});
                }
                outputResults({usingColumnHeadings: true}, tableRows)
            });
            break;

        default:
            // if not being required as a module, show help.
            if (require.main === module) {
                yargs.showHelp();
            }
    }
}

// Only process args if not required as a module. Will also display any errors that get raised.
if (require.main === module) {
    try {
        processArgs();
    } catch (e) {
        console.error(e.message);
    }
}

module.exports = {outputResults, processArgs, command};

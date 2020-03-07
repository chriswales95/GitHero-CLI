"use strict";

/**
 * Abstract class for Commands
 */
class Command {
    execute() {
        if (this.constructor === Command)
            throw new Error("abstract class");

        this.log();
    }

    log() {
        console.log(`${this.constructor.name} executed...`);
    }
}

/**
 *
 */
class GetReposCommand extends Command {

    execute() {
        super.execute();

        let GitHub = require('./GitHub'),
            gh = new GitHub(app.config.token);

        return gh.getRepos(app.args.num ? app.args.num : 10)
    }
}

class GetIssuesCommand extends Command {

    constructor(endCursor, numToFetch) {
        super();
        this.endCursor = endCursor;
        this.numToFetch = numToFetch;
    }

    async execute() {
        super.execute();

        let GitHub = require('./GitHub'),
            gh = new GitHub(app.config.token);

        let resObj = {
            res: {},
            nodes: []
        };

        let numNeeded = app.args.num;
        let pages = Math.ceil((numNeeded / 100));
        let endCursor = null;

        for (let i = 0; i < pages; i++) {
            let res = await gh.getIssuesFromRepo(app.args.account, app.args.repository, numNeeded ? numNeeded : 10, endCursor);
            resObj.res = res;
            resObj.nodes = resObj.nodes.concat(res.nodes);
            endCursor = `\"${res.pageInfo.endCursor}\"`;
            numNeeded -= 100;
        }

        return resObj;
    }
}

class GetPrsCommand extends Command {

    constructor(endCursor, numToFetch) {
        super();
        this.endCursor = endCursor;
        this.numToFetch = numToFetch;
    }

    async execute() {
        super.execute();

        let resObj = {
            res: {},
            nodes: []
        };
        let GitHub = require('./GitHub'),
            gh = new GitHub(app.config.token);

        let numNeeded = app.args.num;
        let pages = Math.ceil((numNeeded / 100));
        let endCursor = null;

        for (let i = 0; i < pages; i++) {
            let res = await gh.getPullRequests(app.args.account, app.args.repository, numNeeded ? numNeeded : 10, endCursor);
            resObj.res = res;
            resObj.nodes = resObj.nodes.concat(res.nodes);
            endCursor = `\"${res.pageInfo.endCursor}\"`;
            numNeeded -= 100;
        }
        return resObj;
    }
}

class GetGistsCommand extends Command {

    execute() {
        super.execute();

        let GitHub = require('./GitHub'),
            gh = new GitHub(app.config.token);

        return gh.getGists(app.args.num ? app.args.num : 10)
    }
}

module.exports = {GetReposCommand, GetIssuesCommand, GetPrsCommand, GetGistsCommand};
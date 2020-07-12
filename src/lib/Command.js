"use strict";

/**
 * @class
 * @classdesc Abstract class for Commands
 */
class Command {

    /**
     * @constructor
     * @param usesGithubV4 {boolean} uses the GitHub GraphQL API
     */
    constructor(usesGithubV4 = false) {
        this._usesGithubV4 = usesGithubV4;
        this._numNeeded = app.args.num ? app.args.num : 10;
        this._pages = 0;
        this._output = null;
    }

    get usesGithubV4() {
        return this._usesGithubV4;
    }

    set usesGithubV4(value) {
        this._usesGithubV4 = value;
    }

    get numNeeded() {
        return this._numNeeded;
    }

    set numNeeded(value) {
        this._numNeeded = value;
    }

    get pages() {
        return this._pages;
    }

    set pages(value) {
        this._pages = value;
    }

    get output() {
        return this._output;
    }

    set output(value) {
        this._output = value;
    }

    /**
     * Asynchronous execution of a command
     *
     * @param command {Object} command object
     * @param params {Object} object which specifies parameters
     * @returns {Promise<null>}
     */
    async execute(command, params) {
        if (this.constructor === Command)
            throw new Error("abstract class");

        this.pages = Math.ceil((this._numNeeded / 100));

        let [c, cmd] = command;
        if (this.usesGithubV4) {
            let resObj = {
                res: {},
                nodes: []
            };
            for (let i = 0; i < this._pages; i++) {
                let res = await c[`${cmd.name}`]({...params});
                resObj.res = res;
                resObj.nodes = resObj.nodes.concat(res.nodes);
                if (this.pages > 1) {
                    params.endCursor = res.pageInfo.endCursor ? `\"${res.pageInfo.endCursor}\"` : '';
                    params.numNeeded -= 100;
                    if (params.endCursor === "")
                        break;
                }
            }
            this.output = resObj;
        } else {
            let res = await c[`${cmd.name}`]({...params});
            this.output = res;
        }

        this.log();
        return this.output;
    }

    /**
     * @todo implement logging
     */
    log() {
        //    console.log(`${this.constructor.name} executed...`);
    }
}

/**
 * @inheritDoc
 * @extends {Command}
 */
class GetReposCommand extends Command {

    /**
     * @inheritDoc
     */
    constructor() {
        super(true);
    }

    /**
     * @inheritDoc
     */
    async execute(command, params) {

        let GitHub = require('./GitHub'),
            gh = new GitHub(app.config.token);

        return super.execute([gh, gh.getRepos], {
            numNeeded: app.args.num ? app.args.num : 10,
            endCursor: null
        });
    }
}

/**
 * @inheritDoc
 * @extends {Command}
 */
class GetIssuesCommand extends Command {

    /**
     * @inheritDoc
     */
    constructor() {
        super();
        this.usesGithubV4 = true;
    }

    /**
     * @inheritDoc
     */
    async execute(command, params) {

        let GitHub = require('./GitHub'),
            gh = new GitHub(app.config.token);

        return super.execute([gh, gh.getIssuesFromRepo], {
            owner: app.args.account,
            repo: app.args.repository,
            numNeeded: app.args.num ? app.args.num : 10,
            endCursor: null
        });
    }
}

/**
 * @extends {Command}
 * @inheritDoc
 */
class GetPrsCommand extends Command {

    /**
     * @inheritDoc
     */
    constructor() {
        super(true);
    }

    /**
     * @inheritDoc
     * @returns {Promise<null>}
     */
    async execute(command, params) {

        let GitHub = require('./GitHub'),
            gh = new GitHub(app.config.token);

        return super.execute([gh, gh.getPullRequests], {
            owner: app.args.account,
            repo: app.args.repository,
            numNeeded: app.args.num ? app.args.num : 10,
            endCursor: null
        });
    }
}

/**
 * @extends {Command}
 * @inheritDoc
 */
class GetGistsCommand extends Command {

    /**
     * @inheritDoc
     */
    constructor() {
        super(true);
    }

    /**
     * @inheritDoc
     * @returns {Promise<null>}
     */
    async execute(command, params) {

        let GitHub = require('./GitHub'),
            gh = new GitHub(app.config.token);

        return super.execute([gh, gh.getGists], {
            numNeeded: app.args.num ? app.args.num : 10,
            endCursor: null
        });
    }
}

/**
 * @extends {Command}
 * @inheritDoc
 */
class GetNotificationsCommand extends Command {

    /**
     * @inheritDoc
     */
    constructor() {
        super(false);
    }

    /**
     * @inheritDoc
     * @returns {Promise<null>}
     */
    async execute(command, params) {

        let GitHub = require('./GitHub'),
            gh = new GitHub(app.config.token);

        return super.execute([gh, gh.getNotifications], {username: app.config.username});
    }
}

class GetRepositorySummaryCommand extends Command {
    constructor() {
        super(true);
    }

    async execute(command, params) {

        let GitHub = require('./GitHub'),
            gh = new GitHub(app.config.token);

        return super.execute([gh, gh.getRepositorySummary], {
            owner: app.args.account,
            repo: app.args.repository
        });
    }

}

module.exports = {
    GetReposCommand,
    GetIssuesCommand,
    GetPrsCommand,
    GetGistsCommand,
    GetNotificationsCommand,
    GetRepositorySummaryCommand
};
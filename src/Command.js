"use strict";

/**
 * Abstract class for Commands
 */
class Command {

    constructor(usesGithubV4 = false) {
        this.githubV4 = usesGithubV4;
    }

    numNeeded = app.args.num ? app.args.num : 10;
    pages = 0;
    output = null;

    async execute(command, params) {
        if (this.constructor === Command)
            throw new Error("abstract class");

        this.pages = Math.ceil((this.numNeeded / 100));

        let [c, cmd] = command;
        if (this.githubV4) {
            let resObj = {
                res: {},
                nodes: []
            };
            for (let i = 0; i < this.pages; i++) {
                let res = await c[`${cmd.name}`]({...params});
                resObj.res = res;
                resObj.nodes = resObj.nodes.concat(res.nodes);
                params.endCursor = `\"${res.pageInfo.endCursor}\"`;
                params.numNeeded -= 100;
            }
            this.output = resObj;
        }
        this.log();
        return this.output;
    }

    log() {
        //    console.log(`${this.constructor.name} executed...`);
    }
}

/**
 *
 */
class GetReposCommand extends Command {


    constructor() {
        super();
        this.githubV4 = true;
    }

    async execute(command, params) {

        let GitHub = require('./GitHub'),
            gh = new GitHub(app.config.token);

        return super.execute([gh, gh.getRepos], {
            numNeeded: app.args.num ? app.args.num : 10,
            endCursor: null
        });
    }
}

class GetIssuesCommand extends Command {

    constructor() {
        super();
        this.githubV4 = true;
    }

    async execute() {

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

class GetPrsCommand extends Command {

    constructor() {
        super();
        this.githubV4 = true;
    }

    async execute() {

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

class GetGistsCommand extends Command {

    constructor() {
        super();
        this.githubV4 = true;
    }

    async execute() {

        let GitHub = require('./GitHub'),
            gh = new GitHub(app.config.token);

        return super.execute([gh, gh.getGists], {
            numNeeded: app.args.num ? app.args.num : 10,
            endCursor: null
        });
    }
}

module.exports = {GetReposCommand, GetIssuesCommand, GetPrsCommand, GetGistsCommand};
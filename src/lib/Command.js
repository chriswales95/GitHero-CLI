"use strict";

/**
 * @class Command
 * @classdesc Abstract class for Commands
 */
class Command {

    /**
     * @constructor
     */
    constructor() {
        if (this.constructor === Command)
            throw new Error("Cannot instantiate abstract class");
    }

    /**
     * Generic command that returns output of command
     *
     * @param command callback function
     * @param args arguments that is passed into the callback
     * @returns {Promise<*>}
     */
    async execute(command, args) {
        return command({...args});
    }
}

/**
 * @class GitHubV4Command
 * @classdesc a class used to run GraphQL queries through GitHub's API
 * @extends {Command}
 */
class GitHubV4Command extends Command {

    static search_not_found_error = 'There was an error fetching the repository. Did you provide a valid URL?';

    /**
     * Execute a GitHubV4Command command with specific handling for pagination
     *
     * @inheritDoc
     * @returns {Promise}
     */
    async execute(command, args) {

        let output = {
                nodes: []
            },
            endCursor = null,
            numNeeded = app.args.num;

        try {
            let pages = Math.ceil((app.args.num / 100)),
                i = 0;

            if (!isNaN(pages)) {
                do {
                    if (numNeeded > 100)
                        args.numNeeded = 100;

                    if (endCursor !== null)
                        args.endCursor = endCursor;

                    let res = await command({...args});

                    if (res.hasOwnProperty('pageInfo'))
                        endCursor = res.pageInfo.endCursor ? `"${res.pageInfo.endCursor}"` : '';

                    output.nodes = output.nodes.concat(res.nodes);
                    i++;

                    if (res.pageInfo.hasNextPage === false)
                        break;

                } while (i <= pages);
            } else {
                return super.execute(command, args);
            }

            return output;

        } catch (e) {
            return e;
        }
    }
}

/**
 * @inheritDoc
 * @extends {GitHubV4Command}
 */
class GetReposCommand extends GitHubV4Command {

    /**
     * @returns {Promise<null>}
     */
    async execute() {

        let GitHub = require('./GitHub');
        return super.execute(async (options) => {

            let response = await GitHub.performGraphQlApiRequest({
                query: `query { 
                  viewer {
                    repositories(first: ${options.numNeeded}, after: ${options.endCursor}) {
                      totalCount
                      pageInfo {
                        startCursor
                        endCursor
                        hasPreviousPage
                        hasNextPage
                      }
                      edges {
                        cursor
                        node {
                          name
                          isFork
                          updatedAt
                          url
                          sshUrl
                        }
                      }
                    }
                  }
                }`
            });

            if (response instanceof Error)
                return response;

            return {
                nodes: response.data.data.viewer.repositories.edges,
                count: response.data.data.viewer.repositories.totalCount,
                pageInfo: response.data.data.viewer.repositories.pageInfo
            };

        }, {numNeeded: app.args.num ? app.args.num : 10, endCursor: null});
    }
}

/**
 * @inheritDoc
 * @extends {GitHubV4Command}
 */
class GetIssuesCommand extends GitHubV4Command {

    /**
     * @returns {Promise<null>}
     */
    async execute() {

        let GitHub = require('./GitHub');

        return super.execute(async (options) => {

            let response = await GitHub.performGraphQlApiRequest({
                query: `{
                    search(query: "${new URL(options.repo).pathname}", type: REPOSITORY, first: 1) {
                      edges {
                        node {
                          ... on Repository {
                            issues(first: ${options.numNeeded}, after: ${options.endCursor}) {
                              pageInfo {
                                endCursor
                                hasNextPage
                                startCursor
                                hasPreviousPage
                              }
                              totalCount
                              edges {
                                node {
                                  author {
                                    login
                                  }
                                  createdAt
                                  updatedAt
                                  number
                                  url
                                  title
                                  closed
                                  participants(first: 3) {
                                    nodes {
                                      email
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                   }
                 }
               `
            });

            if (response instanceof Error)
                return response;

            if (response.data.data.search.edges.length === 0)
                return new Error(GitHubV4Command.search_not_found_error);

            return {
                nodes: response.data.data.search.edges[0].node.issues.edges,
                count: response.data.data.search.edges[0].node.issues.totalCount,
                pageInfo: response.data.data.search.edges[0].node.issues.pageInfo
            }

        }, {
            numNeeded: app.args.num ? app.args.num : 10,
            endCursor: null,
            repo: app.args.url,
        });
    }
}

/**
 * @inheritDoc
 * @extends {GitHubV4Command}
 */
class GetPrsCommand extends GitHubV4Command {

    /**
     * @returns {Promise<null>}
     */
    async execute() {

        let GitHub = require('./GitHub');

        return super.execute(async (options) => {

            let response = await GitHub.performGraphQlApiRequest({
                query: `query {
                          search(query: "${new URL(options.repo).pathname}", type: REPOSITORY, first: 1) {
                            nodes {
                              ... on Repository {
                                pullRequests(states: OPEN, orderBy: {field: CREATED_AT, direction: DESC}, first: ${options.numNeeded}, after: ${options.endCursor}) {
                                  pageInfo {
                                    startCursor
                                    hasNextPage
                                    endCursor
                                  }
                                  totalCount
                                  edges {
                                    cursor
                                    node {
                                      updatedAt
                                      state
                                      title
                                      author {
                                        login
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }`
            });

            if (response instanceof Error)
                return response;


            if (response.data.data.search.nodes.length === 0)
                return new Error(GitHubV4Command.search_not_found_error);

            return {
                nodes: response.data.data.search.nodes[0].pullRequests.edges,
                count: response.data.data.search.nodes[0].pullRequests.totalCount,
                pageInfo: response.data.data.search.nodes[0].pullRequests.pageInfo
            }
        }, {
            numNeeded: app.args.num ? app.args.num : 10,
            endCursor: null,
            repo: app.args.url,
        });
    }
}

/**
 * @extends {GitHubV4Command}
 * @inheritDoc
 */
class GetGistsCommand extends GitHubV4Command {

    /**
     * @returns {Promise<null>}
     */
    async execute() {

        let GitHub = require('./GitHub');

        return super.execute(async (options) => {

            try {
                let response = await GitHub.performGraphQlApiRequest({
                    query: `{
                  viewer {
                    resourcePath
                    gists(first: ${options.numNeeded}, privacy: ALL, after: ${options.endCursor}) {
                      totalCount
                      pageInfo {
                        startCursor
                        endCursor
                        hasNextPage
                        hasPreviousPage
                      }
                      edges {
                        cursor
                        node {
                          description
                          url
                          isPublic
                          isFork
                          resourcePath
                        }
                      }
                    }
                  }
                }`
                });

                if (response instanceof Error)
                    return response;

                return {
                    nodes: response.data.data.viewer.gists.edges,
                    count: response.data.data.viewer.gists.totalCount,
                    pageInfo: response.data.data.viewer.gists.pageInfo
                }
            } catch (e) {
                return e;
            }
        }, {numNeeded: app.args.num ? app.args.num : 10, endCursor: null});
    }
}

/**
 * @extends {GitHubV4Command}
 * @inheritDoc
 */
class GetNotificationsCommand extends Command {

    /**
     * @returns {Promise<null>}
     */
    async execute() {

        let GitHub = require('./GitHub');

        return super.execute(() => {
            return GitHub.performRestApiRequest('https://api.github.com/notifications')
        })
    }
}

/**
 * @extends {GitHubV4Command}
 * @inheritDoc
 */
class GetRepositorySummaryCommand extends GitHubV4Command {

    /**
     * @returns {Promise<null>}
     */
    async execute() {

        let GitHub = require('./GitHub');

        return super.execute(async (options) => {

            let response = await GitHub.performGraphQlApiRequest({
                query: `query {
                          search(query: "${new URL(options.repo).pathname}", type: REPOSITORY, first: 1) {
                            nodes {
                              ... on Repository {
                                nameWithOwner
                                description
                                createdAt
                                diskUsage
                                homepageUrl
                                sshUrl
                                url
                                stargazers {
                                  totalCount
                                }
                                isTemplate
                                isPrivate
                                isMirror
                                isLocked
                                isFork
                                isArchived
                                isDisabled
                                hasWikiEnabled
                                forkCount
                                licenseInfo {
                                  nickname
                                }
                                hasProjectsEnabled
                                issues(states: OPEN) {
                                  totalCount
                                }
                                hasIssuesEnabled
                                id
                                pullRequests(states: OPEN) {
                                  totalCount
                                }
                                pushedAt
                                updatedAt
                              }
                            }
                          }
                        }`
            });

            if (response instanceof Error)
                return response;

            if (response.data.data.search.nodes.length === 0)
                return new Error(GitHubV4Command.search_not_found_error);

            return response;
        }, {repo: app.args.url});
    }
}

module.exports = {
    Command,
    GetReposCommand,
    GetIssuesCommand,
    GetPrsCommand,
    GetGistsCommand,
    GetNotificationsCommand,
    GetRepositorySummaryCommand
};

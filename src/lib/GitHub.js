"use strict";

/**
 * @class
 * @classdesc Class to interact with GitHub
 */
class GitHub {

    /**
     * Constructor
     *
     * @constructor
     * @param token {string} users API token
     */
    constructor(token) {
        this._token = token;
    }

    /**
     * Returns token
     *
     * @returns {string}
     */
    get token() {
        return this._token;
    }

    /**
     * Get Gists
     *
     * @param options {Object} options object
     * @returns {Promise<T[]>}
     */
    async getGists(options) {

        if (options.numNeeded > 100)
            options.numNeeded = 100;

        let response = await require('axios').default.post("https://api.github.com/graphql", {
            query: "{\n" +
                "  viewer {\n" +
                "    resourcePath\n" +
                `    gists(first: ${options.numNeeded}, privacy: ALL, after: ${options.endCursor}) {\n` +
                "      totalCount\n" +
                "      pageInfo {\n" +
                "        startCursor\n" +
                "        endCursor\n" +
                "        hasNextPage\n" +
                "        hasPreviousPage\n" +
                "      }\n" +
                "      edges {\n" +
                "        cursor\n" +
                "        node {\n" +
                "          description\n" +
                "          url\n" +
                "          isPublic\n" +
                "          isFork\n" +
                "          resourcePath\n" +
                "        }\n" +
                "      }\n" +
                "    }\n" +
                "  }\n" +
                "}\n"
        }, {headers: {Authorization: "Bearer " + this.token}});

        return {
            nodes: response.data.data.viewer.gists.edges,
            count: response.data.data.viewer.gists.totalCount,
            pageInfo: response.data.data.viewer.gists.pageInfo
        }
    }

    /**
     * Get repos
     *
     * @param options {Object} options object
     * @returns {Promise<T[]>}
     */
    async getRepos(options) {

        if (options.numNeeded > 100)
            options.numNeeded = 100;

        let response = await require('axios').default.post("https://api.github.com/graphql", {
            query: "query { \n" +
                `  viewer {\n` +
                `    repositories(first: ${options.numNeeded}, after: ${options.endCursor}) {\n` +
                "      totalCount\n" +
                "      pageInfo {\n" +
                "        startCursor\n" +
                "        endCursor\n" +
                "        hasPreviousPage\n" +
                "        hasNextPage\n" +
                "      }\n" +
                "      edges {\n" +
                "        cursor\n" +
                "        node {\n" +
                "          name\n" +
                "          isFork\n" +
                "          updatedAt\n" +
                "          url\n" +
                "          sshUrl\n" +
                "        }\n" +
                "      }\n" +
                "    }\n" +
                "  }\n" +
                "}"
        }, {headers: {Authorization: "Bearer " + this.token}});

        return {
            nodes: response.data.data.viewer.repositories.edges,
            count: response.data.data.viewer.repositories.totalCount,
            pageInfo: response.data.data.viewer.repositories.pageInfo
        };
    }

    /**
     * Gets issues from a specified repository
     *
     * @param options{Object} options object
     * @returns {Promise<T[]>}
     */
    async getIssuesFromRepo(options) {

        if (options.numNeeded > 100)
            options.numNeeded = 100;

        let response = await require('axios').default.post("https://api.github.com/graphql", {
            query: "query " +
                "{\n" +
                `repository(name: \"${options.repo}\", owner: \"${options.owner}\") {\n` +
                `    issues(first: ${options.numNeeded}, after: ${options.endCursor}) {\n` +
                "      pageInfo {\n" +
                "        endCursor\n" +
                "        hasNextPage\n" +
                "        startCursor\n" +
                "        hasPreviousPage\n" +
                "      }\n" +
                "      totalCount\n" +
                "      edges {\n" +
                "        node {\n" +
                "          author {\n" +
                "            login\n" +
                "          }\n" +
                "          createdAt\n" +
                "          updatedAt\n" +
                "          number\n" +
                "          url\n" +
                "          title\n" +
                "          closed\n" +
                "          participants(first: 3) {\n" +
                "            nodes {\n" +
                "              email\n" +
                "            }\n" +
                "          }\n" +
                "        }\n" +
                "      }\n" +
                "    }\n" +
                "  }\n" +
                "}"
        }, {headers: {Authorization: "Bearer " + this.token}});

        if (typeof response !== 'undefined') {
            return {
                nodes: response.data.data.repository.issues.edges,
                count: response.data.data.repository.issues.totalCount,
                pageInfo: response.data.data.repository.issues.pageInfo
            }
        } else {
            throw new Error('Was unable to fetch details on repository');
        }
    }

    /**
     * Get pull requests from a repository
     *
     * @param options
     * @returns {Promise<T[]>}
     */
    async getPullRequests(options) {

        if (options.numNeeded > 100)
            options.numNeeded = 100;

        let response = await require('axios').default.post("https://api.github.com/graphql", {
            query: "query { \n" +
                `  repository(owner: \"${options.owner}\", name:\"${options.repo}\"){\n` +
                `    pullRequests(first: ${options.numNeeded}, after: ${options.endCursor}) {\n` +
                "      pageInfo {\n" +
                "        startCursor\n" +
                "        hasNextPage\n" +
                "        endCursor\n" +
                "      }\n" +
                "      totalCount\n" +
                "      edges {\n" +
                "        cursor\n" +
                "        node {\n" +
                "          updatedAt\n" +
                "          state\n" +
                "          title\n" +
                "          author {\n" +
                "            login\n" +
                "          }\n" +
                "        }\n" +
                "      }\n" +
                "    }\n" +
                "  }\n" +
                "}"
        }, {headers: {Authorization: "Bearer " + this.token}});

        if (typeof response !== 'undefined') {
            return {
                nodes: response.data.data.repository.pullRequests.edges,
                count: response.data.data.repository.pullRequests.totalCount,
                pageInfo: response.data.data.repository.pullRequests.pageInfo
            }
        } else {
            throw new Error('Was unable to fetch details on repository');
        }
    }

    /**
     * Get notifications for the user
     *
     * @param options
     * @returns {Promise<T[]>}
     */
    async getNotifications(options) {

        if (!options.username) {
            console.log("Githero needs your username for this feature\nplease supply your username via the configuration command\ngithero config --username=<username>");
        }
        let response = await require('axios').default.get(' https://api.github.com/notifications', {
            auth: {
                username: this.username,
                password: this.token
            }
        });
        return response;
    }

    /**
     * Get a summary of a repository
     *
     * @param options
     * @returns {Promise<T[]>}
     */
    async getRepositorySummary(options) {

        let response = await require('axios').default.post("https://api.github.com/graphql", {
            query: "{\n" +
                `  repository(owner: \"${options.owner}\", name: \"${options.repo}\") {\n` +
                "nameWithOwner" +
                "    description\n" +
                "    createdAt\n" +
                "    diskUsage\n" +
                "    homepageUrl\n" +
                "    sshUrl\n" +
                "    url\n" +
                "    stargazers {\n" +
                "      totalCount\n" +
                "    }\n" +
                "    isTemplate\n" +
                "    isPrivate\n" +
                "    isMirror\n" +
                "    isLocked\n" +
                "    isFork\n" +
                "    isArchived\n" +
                "    isDisabled\n" +
                "    hasWikiEnabled\n" +
                "    forkCount\n" +
                "    licenseInfo {\n" +
                "      nickname\n" +
                "    }\n" +
                "    hasProjectsEnabled\n" +
                "    issues(states: OPEN) {\n" +
                "      totalCount\n" +
                "    }\n" +
                "    hasIssuesEnabled\n" +
                "    id\n" +
                "    pullRequests(states: OPEN) {\n" +
                "      totalCount\n" +
                "    }\n" +
                "    pushedAt\n" +
                "    updatedAt\n" +
                "  }\n" +
                "}\n" +
                "\n"
        }, {headers: {Authorization: "Bearer " + this.token}});

        return response;
    }
}

module.exports = GitHub;

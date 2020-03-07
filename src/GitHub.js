"use strict";

/**
 * Class to interact with GitHub
 */
class GitHub {

    /**
     * Constructor
     *
     * @constructor
     * @param token
     */
    constructor(token) {
        this.token = token
    }

    /**
     * Get Gists
     *
     * @param numberOfGists
     * @returns {Promise<T[]>}
     */
    async getGists(numberOfGists) {

        let response = await require('axios').default.post("https://api.github.com/graphql", {
            query: "query {\n" +
                "  viewer {\n" +
                "    resourcePath\n" +
                `    gists(first: ${numberOfGists}, privacy: ALL) {\n` +
                "    totalCount\n" +
                "      nodes {\n" +
                "        description\n" +
                "        url\n" +
                "        isPublic\n" +
                "        isFork\n" +
                "        resourcePath\n" +
                "      }\n" +
                "    }\n" +
                "  }\n" +
                "}\n"
        }, {headers: {Authorization: "Bearer " + this.token}});

        return response.data.data.viewer.gists.nodes.map(gist => {
            return gist;
        });
    }

    /**
     * Get repos
     *
     * @param numberOfGists
     * @returns {Promise<T[]>}
     */
    async getRepos(numberOfGists) {

        let response = await require('axios').default.post("https://api.github.com/graphql", {
            query: "query {\n" +
                "  viewer {\n" +
                "    resourcePath\n" +
                `    repositories(first: ${numberOfGists}) {\n` +
                "      totalCount\n" +
                "      nodes {\n" +
                "        name\n" +
                "        isFork\n" +
                "        url\n" +
                "        sshUrl\n" +
                "        updatedAt\n" +
                "      }\n" +
                "    }\n" +
                "  }\n" +
                "}\n"
        }, {headers: {Authorization: "Bearer " + this.token}});

        return response.data.data.viewer.repositories.nodes.map(repo => {
            let date = new Date(repo.updatedAt);
            repo.updatedAt = `${date.toLocaleDateString()} ${date.toTimeString()}`;
            return repo;
        });
    }

    /**
     * Gets issues from a specified repository
     *
     * @param owner
     * @param repo
     * @param numberOfIssues
     * @returns {Promise<T[]>}
     */
    async getIssuesFromRepo(owner, repo, numberOfIssues) {

        let response = await require('axios').default.post("https://api.github.com/graphql", {
            query: "query {" +
                `repository(name: \"${repo}\", owner: \"${owner}\") {\n` +
                `    issues(first: ${numberOfIssues}) {\n` +
                "      nodes {\n" +
                "        author {\n" +
                "          login\n" +
                "        }\n" +
                "        createdAt\n" +
                "        updatedAt\n" +
                "        number\n" +
                "        url\n" +
                "        title\n" +
                "      participants(first: 3){\n" +
                "          nodes {\n" +
                "            email\n" +
                "          }\n" +
                "        }\n" +
                "      }\n" +
                "    }\n" +
                "  }" +
                "}"
        }, {headers: {Authorization: "Bearer " + this.token}});

        if (typeof response !== 'undefined') {
            return response.data.data.repository.issues.nodes;
        } else {
            throw new Error('Was unable to fetch details on repository');
        }
    }

    /**
     * Get pull requests from a repository
     *
     * @param owner
     * @param repo
     * @param numberOfPrs
     * @param endCursor
     * @returns {Promise<T[]>}
     */
    async getPullRequests(owner, repo, numberOfPrs, endCursor = null) {

        if (numberOfPrs > 100)
            numberOfPrs = 100;

        // easier to handle formatting but a bit messy...
        let endCursorQuery = `    pullRequests(first: ${numberOfPrs}, after: ${endCursor}){\n`;
        if (endCursor)
            endCursorQuery = `    pullRequests(first: ${numberOfPrs}, after: \"${endCursor}\"){\n`;

        let response = await require('axios').default.post("https://api.github.com/graphql", {
            query: "query { \n" +
                `  repository(owner: \"${owner}\", name:\"${repo}\"){\n` +
                endCursorQuery +
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
}

module.exports = GitHub;
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
     * @param endCursor
     * @returns {Promise<T[]>}
     */
    async getGists(numberOfGists, endCursor = null) {

        if (numberOfGists > 100)
            numberOfGists = 100;

        let response = await require('axios').default.post("https://api.github.com/graphql", {
            query: "{\n" +
                "  viewer {\n" +
                "    resourcePath\n" +
                `    gists(first: ${numberOfGists}, privacy: ALL, after: ${endCursor}) {\n` +
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
     * @param numberOfRepos
     * @returns {Promise<T[]>}
     */
    async getRepos(numberOfRepos, endCursor) {

        if (numberOfRepos > 100)
            numberOfRepos = 100;

        let response = await require('axios').default.post("https://api.github.com/graphql", {
            query: "query { \n" +
                `  viewer {\n` +
                `    repositories(first: ${numberOfRepos}, after: ${endCursor}) {\n` +
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
     * @param owner
     * @param repo
     * @param numberOfIssues
     * @param endCursor
     * @returns {Promise<T[]>}
     */
    async getIssuesFromRepo(owner, repo, numberOfIssues, endCursor = null) {

        if (numberOfIssues > 100)
            numberOfIssues = 100;

        let response = await require('axios').default.post("https://api.github.com/graphql", {
            query: "query " +
                "{\n" +
                `repository(name: \"${repo}\", owner: \"${owner}\") {\n` +
                `    issues(first: ${numberOfIssues}, after: ${endCursor}) {\n` +
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
     * @param owner
     * @param repo
     * @param numberOfPrs
     * @param endCursor
     * @returns {Promise<T[]>}
     */
    async getPullRequests(owner, repo, numberOfPrs, endCursor = null) {

        if (numberOfPrs > 100)
            numberOfPrs = 100;

        let response = await require('axios').default.post("https://api.github.com/graphql", {
            query: "query { \n" +
                `  repository(owner: \"${owner}\", name:\"${repo}\"){\n` +
                `    pullRequests(first: ${numberOfPrs}, after: ${endCursor}) {\n` +
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
"use strict";

/**
 * @class Git
 */
class Git {

    /**
     * Get Gists
     *
     * @param numberOfGists
     * @param token
     * @returns {Promise<T[]>}
     */
    async getGists(numberOfGists, token) {
        if (!token) {
            throw new Error("token not set");
        }
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
        }, {headers: {Authorization: "Bearer " + token}});

        return response.data.data.viewer.gists.nodes.map(gist => {
            return gist;
        });
    }

    /**
     * Get repos
     *
     * @param numberOfGists
     * @param token
     * @returns {Promise<T[]>}
     */
    async getRepos(numberOfGists, token) {
        if (!token) {
            throw new Error("token not set");
        }
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
        }, {headers: {Authorization: "Bearer " + token}});

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
     * @param token
     * @returns {Promise<T[]>}
     */
    async getIssuesFromRepo(owner, repo, numberOfIssues, token) {
        if (!token) {
            throw new Error("token not set");
        }

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
        }, {headers: {Authorization: "Bearer " + token}});

        if (response.data.errors[0].message) {
            throw new Error(response.data.errors[0].message);
        }

        if (typeof response !== 'undefined') {
            return response.data.data.repository.issues.nodes;
        } else {
            throw new Error('Was unable to fetch details on repository');
        }
    }
}

module.exports = Git;
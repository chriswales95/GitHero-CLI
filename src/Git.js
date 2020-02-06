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

}

module.exports = Git;
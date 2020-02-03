module.exports = class Git {

    async getGists(numberOfGists, token) {
        let response = await require('axios').default.post("https://api.github.com/graphql", {
            query: "query { \n" +
                "  viewer { \n" +
                "    gists(privacy:ALL, first:" + numberOfGists + "){\n" +
                "     totalCount \n" +
                "      edges {\n" +
                "        node{\n" +
                "          name\n" +
                "          id\n" +
                "          createdAt\n" +
                "          description\n" +
                "          isFork\n" +
                "          isPublic\n" +
                "          __typename\n" +
                "          files{\n" +
                "            encodedName\n" +
                "            extension\n" +
                "            size\n" +
                "          }\n" +
                "        }\n" +
                "      }\n" +
                "    }\n" +
                "  }\n" +
                "}"
        }, {headers: {Authorization: "Bearer " + token}});

        return response.data.data.viewer.gists.edges.map(gist => {
            return gist.node;
        });
    }

};
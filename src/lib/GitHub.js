"use strict";

/**
 * @class GitHub
 * @classdesc Class to interact with GitHub
 */
class GitHub {

    /**
     * Used to perform queries against GitHub V4 API
     *
     * @param options {Object} an object containing a query parameter
     * @returns {Promise}
     */
    static async performGraphQlApiRequest(options) {

        if (!app.config.hasOwnProperty("token"))
            throw new Error('Token is missing from the configuration');

        if (!options.hasOwnProperty('query'))
            throw new Error('No query was provided for the API request');

        try {
            return await require('axios').default.post("https://api.github.com/graphql", {
                query: options.query
            }, {headers: {Authorization: "Bearer " + app.config.token}});
        } catch (e) {
            return e;
        }
    }

    /**
     * Used to perform queries against GitHub V3 API
     *
     * @param url {string} the API endpoint
     * @returns {Promise}
     */
    static async performRestApiRequest(url) {

        if (!app.config.hasOwnProperty("token"))
            throw new Error('Token is missing from the configuration');

        if (!app.config.hasOwnProperty('username'))
            throw new Error('Username is missing from the configuration');

        if (!url)
            throw new Error('No URL provided for the API request')

        try {
            return await require('axios').default.get(url, {
                auth: {
                    username: app.config.username,
                    password: app.config.token
                }
            });
        } catch (e) {
            return e;
        }
    }
}

module.exports = GitHub;

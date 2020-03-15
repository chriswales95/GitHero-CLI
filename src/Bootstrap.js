"use strict";

const os = require('os');
const fs = require('fs');

/**
 * @class
 * @classdesc Creates App instance
 */
class Bootstrap {

    /**
     * Constructor menu
     * @constructor
     * @param {object} args
     */
    constructor(args) {
        this._os = os.platform();
        this._loggingLevel = "normal";
        this._args = args;
        this._config = {};
    }

    /**
     * Returns OS
     *
     * @readonly
     * @returns {NodeJS.Platform}
     */
    get os() {
        return this._os;
    }

    /**
     * Return logging level
     *
     * @returns {string}
     */
    get loggingLevel() {
        return this._loggingLevel;
    }

    /**
     * Set logging level
     *
     * @param value
     */
    set loggingLevel(value) {
        this._loggingLevel = value;
    }

    /**
     * Set arguments
     *
     * @param value
     */
    set args(value) {
        this._args = value;
    }

    /**
     * Set config
     *
     * @param value
     */
    set config(value) {
        this._config = value;
    }

    /**
     * Get config
     *
     * @returns {{}}
     */
    get config() {
        return this._config;
    }

    /**
     * Get args
     *
     * @returns {Object}
     */
    get args() {
        return this._args;
    }

    /**
     * Init the app
     *
     * @returns {Bootstrap}
     */
    init() {

        // Check OS
        if (this.os !== 'darwin') {
            console.warn('Warning: githero has not been tested outside of Mac OS but give it a go');
        }

        // check for config
        try {
            if (!fs.existsSync(`${os.homedir()}/.githero.json`)) {
                // get essential details e.g. api key or we can't do anything
                console.log("\nHold on!\n\nTo continue, you'll need to provide GitHero with an API key from Github! We can't do anything otherwise ¯\\_(ツ)_/¯");
                console.log("https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line");
                this.config = {};
                this.storeConfig(this._config);
            } else {
                // read config
                this.config = JSON.parse(fs.readFileSync(`${os.homedir()}/.githero.json`, 'utf8'));
            }
        } catch (e) {
            console.trace(e);
        }
        this.checkArgs(this.args);
        return this;
    }

    /**
     * Check arguments for config
     *
     * @param args {Object} argument object
     */
    checkArgs(args) {
        let updateConfig = false;
        if (args._.includes('config') && (this.args.token || this.args.t)) {
            this.config.token = this.args.token || this.args.t;
            updateConfig = true;
        }
        if (updateConfig) {
            this.storeConfig(this.config);
        }
    }

    /**
     * Store configuration
     *
     * @param config {Object} config object
     */
    storeConfig(config) {
        fs.writeFile(`${os.homedir()}/.githero.json`, JSON.stringify(config), function (err) {
            if (err) {
                console.log('There has been an error saving your configuration data.');
                console.log(err.message);
            }
        });
    }
}

module.exports = Bootstrap;
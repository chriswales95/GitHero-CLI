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
     *
     * @returns {string}
     */
    get configurationStorage() {
        return `${os.homedir()}/.githero.json`;
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
     * @param newLoggingLevel
     */
    set loggingLevel(newLoggingLevel) {
        this._loggingLevel = newLoggingLevel;
    }

    /**
     * Set arguments
     *
     * @param newArgsValue
     */
    set args(newArgsValue) {
        this._args = newArgsValue;
    }

    /**
     * Set config
     *
     * @param newConfigurationObject
     */
    set config(newConfigurationObject) {
        this._config = newConfigurationObject;
    }

    /**
     * Get config
     *
     * @returns {Object}
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

        // check for config
        try {
            if (!fs.existsSync(this.configurationStorage)) {
                // get essential details e.g. api key or we can't do anything
                this.config = {};
                this.storeConfig(this._config);
            } else {
                // read config
                this.config = JSON.parse(fs.readFileSync(this.configurationStorage, 'utf8'));
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
     * @param args
     * @returns {boolean}
     */
    checkArgs(args) {
        let updateConfig = false;
        if (args._.includes('config') && (this.args.token || this.args.t)) {
            this.config.token = this.args.token || this.args.t;
            updateConfig = true;
        }

        if (args._.includes('config') && (this.args.username || this.args.u)) {
            this.config.username = this.args.username || this.args.u;
            updateConfig = true;
        }

        if (updateConfig) {
            this.storeConfig(this.config);
        }

        return updateConfig
    }

    /**
     * Store configuration
     *
     * @param config {Object} config object
     */
    storeConfig(config) {
        fs.writeFile(this.configurationStorage, JSON.stringify(config), function (err) {
            if (err) {
                console.log('There has been an error saving your configuration data.');
                console.log(err.message);
            }
        });
    }
}

module.exports = Bootstrap;
"use strict";

const os = require('os');
const process = require('process');
const {exec} = require("child_process");
const Git = require('./Git');
const fs = require('fs');

/**
 * @class Bootstrap
 */
module.exports = class Bootstrap {

    /**
     * Constructor menu
     * @param args
     */
    constructor(args) {
        this._os = os.platform();
        this._loggingLevel = "normal";
        this._args = args;
        this._config = {};
    }

    /**
     * Initialise the app
     */
    init() {

        // Check OS
        if (this._os !== 'darwin') {
            console.warn('Warning: githero has not been tested outside of Mac OS but give it a go');
        }

        // check for config
        try {
            if (!fs.existsSync(`${os.homedir()}/.githero.json`)) {
                // get essential details e.g. api key or we can't do anything
                console.log("\nHold on!\n\nTo continue, you'll need to provide GitHero with an API key from Github! We can't do anything otherwise ¯\\_(ツ)_/¯");
                console.log("https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line");
                this._config = {};
                this.storeConfig(this._config);
            } else {
                // read config
                this._config = JSON.parse(fs.readFileSync(`${os.homedir()}/.githero.json`, 'utf8'));
            }
        } catch (e) {
            console.trace(e);
        }
        this.checkArgs(this._args);
        return this;
    }

    checkArgs(args) {
        let updateConfig = false;
        if (args._.includes('config') && (this._args.token || this._args.t)) {
            this._config.token = this._args.token || this._args.t;
            updateConfig = true;
        }
        if (updateConfig) {
            this.storeConfig(this._config);
        }
    }

    storeConfig(config) {
        fs.writeFile(`${os.homedir()}/.githero.json`, JSON.stringify(config), function (err) {
            if (err) {
                console.log('There has been an error saving your configuration data.');
                console.log(err.message);
            }
        });
    }

    get config() {
        return this._config;
    }
};
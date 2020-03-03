/**
 * Abstract class for Commands
 */
class Command {
    execute() {
        if (this.constructor === Command)
            throw new Error("abstract class");

        this.log();
    }

    log() {
        console.log(`${this.constructor.name} executed...`);
    }
}

/**
 *
 */
class GetReposCommand extends Command {

    execute() {
        super.execute();

        let GitHub = require('./GitHub'),
            gh = new GitHub(app.config.token);

        return gh.getRepos(app.args.num ? app.args.num : 10)
    }
}

class GetIssuesCommand extends Command {

    execute() {
        super.execute();
    }
}

module.exports = {GetReposCommand, GetIssuesCommand};
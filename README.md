Archived in favor of the official [GitHub CLI](https://cli.github.com) 

***

[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com)

![Node.js CI](https://github.com/chriswales95/GitHero-CLI/workflows/Node.js%20CI/badge.svg)
# GitHero-CLI
A tool to interact with GitHub without leaving your terminal.

## Getting started
To use GitHero, you'll need to provide an API key to the CLI. GitHero only interacts with GitHubs API, so naturally can't do anything without it.
You can find out how to obtain an API token [here](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line).

To configure GitHero to use it, all you need to do is run this quick command:
`githero config --token=<your token>`

This is stored in your home directory as ~/.githero.json FYI.

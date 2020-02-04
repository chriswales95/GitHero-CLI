# GitHero-CLI
a little project to make a cli for GitHub with NodeJs

## Getting started
To use GitHero, you'll need to provide an API key to the CLI. GitHero only interacts with GitHubs API, so naturally can't do anything without it.
You can find out how to obtain an API token [here](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line).

To configure GitHero to use it, all you need to do is run this quick command:
`githero config --token=<your token>`

This is stored in your home directory as ~/.githero.json FYI.
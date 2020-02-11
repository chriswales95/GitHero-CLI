let Git = require('../src/Git');
let git = new Git(null);

it('GetRepos should fail without a token', async () => {
    await expect(git.getRepos(1))
        .rejects
        .toThrow('Request failed with status code 401');
});

it('GetGists should fail without a token', async () => {
    await expect(git.getGists(1))
        .rejects
        .toThrow('Request failed with status code 401');
});

it('getPullRequests should fail without a token', async () => {
    await expect(git.getPullRequests("chrisales95", "GitHero-CLI", 1))
        .rejects
        .toThrow('Request failed with status code 401');
});

it('getIssuesFromRepo should fail without a token', async () => {
    await expect(git.getIssuesFromRepo("chrisales95", "GitHero-CLI", 1))
        .rejects
        .toThrow('Request failed with status code 401');
});
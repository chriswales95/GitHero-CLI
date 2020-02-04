let Git = require('../src/Git');
let git = new Git();

it('GetRepos should fail without a token', async () =>  {
    await expect(git.getRepos(1,null))
        .rejects
        .toThrow('token not set');
});

it('GetGists should fail without a token', async () =>  {
    await expect(git.getGists(1,null))
        .rejects
        .toThrow('token not set');
});
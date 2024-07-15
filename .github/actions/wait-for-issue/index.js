const core = require('@actions/core');
const github = require('@actions/github');


function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
    try {
        const TOKEN = core.getInput('github-token');
        const octokit = github.getOctokit(TOKEN);
        const ISSUE_NUM = core.getInput('issue-number');
        const INTERVAL_WAIT_TIME = parseInt(core.getInput('interval-wait-time')) || 1000;
        const MAX_TRY = parseInt(core.getInput(core.getInput('max-try'))) || 1;

        let trycnt = 1;
        let success = false;

        while (trycnt++ <= MAX_TRY) {
            console.log(`try read issue (${trycnt})`);

            const comments = await octokit.rest.issues.listComments({
                owner: github.context.repo.owner,
                repo: github.context.repo.repo,
                issue_number: ISSUE_NUM
            });

            const userComment = comments.find((v) => v.user.type === "User");
            if (userComment) {
                success = true;
                core.setOutput('comment-body', userComment.body);
                break;
            }

            await wait(INTERVAL_WAIT_TIME)
        }

        if (!success) {
            core.setFailed('No response (time over)!');
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}
run();
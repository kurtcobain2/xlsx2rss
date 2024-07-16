const core = require('@actions/core');
const github = require('@actions/github');


function run() {
    try {
        const TOKEN = core.getInput('github-token');
        const octokit = github.getOctokit(TOKEN);
        const ISSUE_NUM = core.getInput('issue-number');
        const COMMENT = core.getInput('comment');
        const STATE = core.getInput('state');
        const STATE_REASON = core.getInput('state-reason') || "completed";

        octokit.rest.issues.createComment({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            issue_number: ISSUE_NUM,
            body: COMMENT
        }).then((res) => {
            if (!!STATE) {
                octokit.rest.issues.update({
                    owner: github.context.repo.owner,
                    repo: github.context.repo.repo,
                    issue_number: ISSUE_NUM,
                    state: STATE,
                    state_reason: STATE_REASON
                }).then((res) => {
                    console.log('success');
                }).catch((err) => {
                    core.setFailed(err);
                })
            }
        }).catch((err) => {
            core.setFailed(err);
        })
    } catch (error) {
        core.setFailed(error.message);
    }
}
run();
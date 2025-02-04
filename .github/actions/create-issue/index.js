const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');


function readBody(type, content, encoding="utf-8") {
    return new Promise((resolve, reject) => {
        try {
            if (type === "text") {
                resolve(content);
            } else if (type === "url") {
                fs.readFile(content, encoding, (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

function run() {
    try {
        const TOKEN = core.getInput('github-token');
        const octokit = github.getOctokit(TOKEN);
        const issueTitle = core.getInput('issue-title');
        const issueBody = core.getInput('issue-body') || "";
        const issueBodyUrl = core.getInput('issue-body-url').trim() || "";
        const encoding = core.getInput('encoding') || "utf-8";
        const LABEL = core.getInput('label').split(",");

        let type = issueBodyUrl.length > 0 ? "url" : "text";
        let content = type === "url" ? issueBodyUrl : issueBody;
        readBody(type, content, encoding).then((data) => {
            octokit.rest.issues.create({
                owner: github.context.repo.owner,
                repo: github.context.repo.repo,
                title: issueTitle,
                body: data,
                labels: LABEL
            }).then((issue) => {
                core.setOutput('issue-number', issue.data.number);
                core.setOutput('issue-url', issue.data.html_url);
            }).catch((err) => {
                core.setFailed(err);
            })
        }).catch(() => {
            core.setFailed(`File Read error`);
        })
    } catch (error) {
        core.setFailed(error.message);
    }
}
run();
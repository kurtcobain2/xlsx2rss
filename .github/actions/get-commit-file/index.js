const core = require('@actions/core');
const github = require('@actions/github');


async function run() {
    try {
        const TOKEN = core.getInput('github-token');
        const octokit = github.getOctokit(TOKEN);
        const FILENAME = core.getInput('file-name') || "";

        octokit.rest.repos.getCommit({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            ref: github.context.sha
        }).then((res) => {
            core.setOutput(
                'files', 
                res.data.files
                    .map((v) => {
                        if (FILENAME.length > 0) {
                            let filenameReg = new RegExp(`^${FILENAME.replace(/\*/g, '.+')}$`);

                            if (!filenameReg.test(v.filename))
                                return undefined;
                        }

                        let filename_splitted = v.filename.split("/");
                        return {
                            name: v.filename,
                            origin_name: filename_splitted[filename_splitted.length-1],
                            status: v.status,
                            url: {
                                blob: v.blob_url,
                                raw: v.raw_url
                            }
                        }
                    })
                    .filter((v) => !!v)
            );
        }).catch((err) => {
            core.setFailed(err);
        })
    } catch (error) {
        core.setFailed(error.message);
    }
}
run();
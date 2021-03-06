import {
    ProjectOperationCredentials,
    TokenCredentials
} from "@atomist/automation-client/lib/operations/common/ProjectOperationCredentials";
import {Octokit} from "@octokit/rest";
import {isInLocalMode} from "@atomist/sdm-core";
import {
    GoalExecutionListenerInvocation,
    GoalInvocation,
    ProjectAwareGoalInvocation,
    SdmContext
} from "@atomist/sdm";
import {logger} from "@atomist/automation-client";
import {createTokenAuth} from "@octokit/auth";

type GHCredsParams = { credentials: ProjectOperationCredentials, __goalTag: false } | GoalInvocation | GoalExecutionListenerInvocation | ProjectAwareGoalInvocation | SdmContext;

export const getGitHubApi = async (gi: GHCredsParams): Promise<Octokit> => {
    if (isInLocalMode()) {
        // @ts-ignore
        const token = gi.configuration.sdmLocal.github.token;
        logger.warn(`GITHUB API CREATED IN LOCAL MODE`);
        return new Octokit({auth: token, authStrategy: createTokenAuth});
    }
    const ghToken = (gi.credentials as TokenCredentials).token;
    return new Octokit({auth: `token ${ghToken}`});
};

export type GitHubPRCommentParams = Octokit.RequestOptions & Octokit.PullsCreateCommentParams;

export async function addCommentToRelevantPR(gi: GoalExecutionListenerInvocation, gh: Octokit, body: string) {
    const ownerAndRepo = {owner: gi.id.owner, repo: gi.id.repo};
    const prs = await gh.pulls.list(ownerAndRepo).then(prs => prs.data.filter(v => v.head.sha === gi.id.sha));
    await Promise.all(prs.map(pr => gh.issues.createComment({...ownerAndRepo, body, issue_number: pr.number})));
}


export const safeBranchDns = (branch: string) => {
    return branch.toLowerCase()
        .replace("_", "-")
        .replace("/", "--")
        .replace(".", "-")
        .replace(/[^a-z0-9\-]*/, "");
}

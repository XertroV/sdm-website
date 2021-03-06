/*
 * Copyright © 2019 Atomist, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Build} from "@atomist/sdm-pack-build";
import {GoalWithFulfillment} from "@atomist/sdm/lib/api/goal/GoalWithFulfillment";
import {SdmGoalEvent} from "@atomist/sdm";
import {GoalInvocation} from "@atomist/sdm/lib/api/goal/GoalInvocation";
import {safeBranchDns} from "../util/github";

type DeliveryGoalWFulfillment = GoalWithFulfillment;
type DeliveryGoals = Record<string, GoalWithFulfillment | Build>;

export const fluxSitePreviewBucket = "sdm-edgelambda-test4-public";
export const fluxSitePreviewBucketRegion = "us-east-1";
// export const fluxAppPreviewBucketRegion = "ap-southeast-2";
// export const fluxAppPreviewBucket = "sdm-edgelambda-test4-public";
export const fluxAppPreviewBucket = fluxSitePreviewBucket;
export const fluxAppPreviewBucketRegion = fluxSitePreviewBucket;
export const fluxPreviewDomain = "preview.flx.dev";

export function getPreviewStub(gi: GoalInvocation) {
    return safeBranchDns(gi.goalEvent.branch);
    // return gi.goalEvent.sha.slice(0, 7);
}

export const mkAppUploadFilename = (ge: SdmGoalEvent, ext: string): string =>
    `fluxApp-${ge.sha.slice(0, 7)}.${ext}`

/**
 * Interface to capture all goals that this SDM will manage
 */
export interface FluxGoals extends DeliveryGoals {
    nop: DeliveryGoalWFulfillment;

    /** Flux App Goals */
    appFlutterInfo: DeliveryGoalWFulfillment;
    appLint: DeliveryGoalWFulfillment;
    appDocs: DeliveryGoalWFulfillment;
    appAndroidTest: DeliveryGoalWFulfillment;
    appAndroidBuild: DeliveryGoalWFulfillment;
    appAndroidSign: DeliveryGoalWFulfillment;
    appAndroidReleaseUpload: DeliveryGoalWFulfillment;
    appAndroidUploadDebug: DeliveryGoalWFulfillment;
    appIosTest: DeliveryGoalWFulfillment;
    appIosBuild: DeliveryGoalWFulfillment;
    appIosSign: DeliveryGoalWFulfillment;
    appIosUploadDebug: DeliveryGoalWFulfillment;
    appIosReleaseUpload: DeliveryGoalWFulfillment;

    /** Flux Site Goals */
    siteBuild: Build;
    siteGenPreviewPng: DeliveryGoalWFulfillment;
    sitePushS3: GoalWithFulfillment;
    siteDeployPreviewCloudFront: GoalWithFulfillment;
    siteDeployPreviewSetupCloudfront: GoalWithFulfillment;
    siteSpellcheck: GoalWithFulfillment;

    /** More general goals */
    // msgAuthor: GoalWithFulfillment;
}

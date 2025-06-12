import { App } from 'cdktf';
import { CdkWorkshopStack } from '../lib/cdk-workshop-stack';

const app = new App();
new CdkWorkshopStack(app, 'CdkWorkshop', {
    environmentName: "Workshop",
    gridUUID: "workshop",
    providerConfig: {
        region: "ap-southeast-1"
    }
});

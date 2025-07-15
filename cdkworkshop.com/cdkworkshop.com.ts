#!/usr/bin/env node

import * as path from 'node:path';
import { App, LocalBackend, TerraformOutput } from 'cdktf';
import type { Construct } from 'constructs';
import { Duration } from 'terraconstructs/lib';
import { AwsStack, type AwsStackProps, edge, storage } from 'terraconstructs/lib/aws';
// import { GuardDutyNotifier } from './guardduty';
import { hashDirectorySync } from './hash';

export interface CdkWorkshopProps extends AwsStackProps {
    /**
     * The ID of the DNS zone to use for the workshop domain
     * (this should be created separately)
     */
    zoneId: string;

    /**
     * The Domain the workshop is hosted at
     */
    domain: string;

    // /**
    //  * Email address to use for AWS GuardDuty security finding notifications
    //  */
    // email: string;
}

// NOTE: Before AWS User Metrics
// https://github.com/aws-samples/aws-cdk-intro-workshop/pull/763/files

// NOTE: Before cdkworkshop.com redirect to aws-catalog
// https://github.com/aws-samples/aws-cdk-intro-workshop/pull/1478/files?diff=unified&w=1#diff-037ad33a0965a87240f9aeb7d2efa871f2012bce547a01b5b3c703b3dc16c0f9

export class CdkWorkshop extends AwsStack {
    constructor(scope: Construct, id: string, props: CdkWorkshopProps) {
        super(scope, id, props);
        const { domain, zoneId } = props;

        // TODO: GuardDuty Support
        // // Enable AWS GuardDuty in this account, and send any security findings via email
        // new GuardDutyNotifier(this, 'GuardDuty', {
        //     environmentName: props.domain,
        //     email: props.email,
        // });

        const zone = edge.DnsZone.fromZoneId(this, 'Zone', zoneId);
        const certificate = new edge.PublicCertificate(this, 'Certificate', {
            domainName: domain,
            validation: {
                method: edge.ValidationMethod.DNS,
                hostedZone: zone,
            },
            lifecycle: {
                createBeforeDestroy: true,
            },
        });

        const contentDir = path.join(__dirname, '..', 'workshop', 'public');
        const contentHash = hashDirectorySync(contentDir);
        // Bucket to hold the static website
        const bucket = new storage.Bucket(this, 'Bucket', {
            cloudfrontAccess: {
                enabled: true,
                keyPatterns: ['*', `${contentHash}/*`],
            },
        });
        bucket.addSource({
            path: contentDir,
            prefix: contentHash,
        });

        const indexHandlerFunc = new edge.Function(this, 'IndexHandler', {
            nameSuffix: 'IndexHandler',
            runtime: edge.FunctionRuntime.JS_2_0,
            // ref: https://github.com/aws-samples/aws-cdk-intro-workshop/blob/8f120cd2a1ec71f4cca4cb027f323fd543b2121e/cdkworkshop.com/indexhandler/index.js
            code: edge.FunctionCode.fromFile({
                filePath: path.join(__dirname, 'indexhandler', 'index.js'),
            }),
        });

        const cspPolicyContent = [
            `default-src 'self' https://${props.domain}`,
            "style-src 'self' 'sha256-biLFinpqYMtWHmXfkA1BPeCY0/fNt46SAZ+BBk5YUog=' fonts.googleapis.com",
            "font-src 'self' fonts.gstatic.com",
            // "script-src 'self' www.google-analytics.com",
        ].join('; ');

        // CloudFront distribution
        const cdn = new edge.Distribution(this, 'CloudFrontDistribution', {
            defaultBehavior: {
                allowedMethods: edge.AllowedMethods.ALLOW_GET_HEAD,
                viewerProtocolPolicy: edge.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                origin: new edge.S3Origin(bucket, {
                    originPath: `/${contentHash}`,
                }),
                responseHeadersPolicy: new edge.ResponseHeadersPolicy(this, 'ResponseHeadersPolicy', {
                    securityHeadersBehavior: {
                        frameOptions: {
                            frameOption: edge.HeadersFrameOption.DENY,
                            override: true,
                        },
                        contentTypeOptions: { override: true },
                        xssProtection: {
                            protection: true,
                            modeBlock: true,
                            override: true,
                        },
                        referrerPolicy: {
                            referrerPolicy: edge.HeadersReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN,
                            override: true,
                        },
                        contentSecurityPolicy: {
                            override: true,
                            contentSecurityPolicy: cspPolicyContent,
                        },
                        strictTransportSecurity: {
                            accessControlMaxAge: Duration.seconds(31536000),
                            includeSubdomains: true,
                            override: true,
                        },
                    },
                }),
                // Rewrite "some/" as "some/index.html"
                functionAssociations: [
                    {
                        // TODO: BUG! Function association is not working?
                        eventType: edge.FunctionEventType.VIEWER_REQUEST,
                        function: indexHandlerFunc,
                    },
                ],
            },
            certificate,
            aliases: [props.domain],
        });
        // DNS alias for the CloudFront distribution
        new edge.ARecord(this, 'CloudFrontDNSRecord', {
            recordName: `${props.domain}.`,
            zone,
            target: edge.RecordTarget.fromAlias(new edge.DistributionTarget(cdn)),
        });

        // // Email security records
        // const emailRecordComment =
        //     'This record restricts email functionality to help prevent spoofing and impersonation events.';
        // new edge.TxtRecord(this, 'EmailSpfRecord', {
        //     zone,
        //     values: ['v=spf1 -all'],
        //     comment: emailRecordComment,
        // });
        // new edge.TxtRecord(this, 'EmailDkimRecord', {
        //     recordName: '*._domainkey',
        //     zone,
        //     values: ['v=DKIM1; p='],
        //     comment: emailRecordComment,
        // });
        // new edge.TxtRecord(this, 'EmailDmarcRecord', {
        //     recordName: '_dmarc',
        //     zone,
        //     values: ['v=DMARC1; p=reject; rua=mailto:report@dmarc.amazon.com; ruf=mailto:report@dmarc.amazon.com'],
        //     comment: emailRecordComment,
        // });

        // Configure Outputs
        new TerraformOutput(this, 'URL', {
            description: 'The URL of the workshop',
            value: `https://${props.domain}`,
        });
        new TerraformOutput(this, 'CloudFrontURL', {
            description: 'The CloudFront distribution URL',
            value: `https://${cdn.domainName}`,
        });
        new TerraformOutput(this, 'CertificateArn', {
            description: 'The SSL certificate ARN',
            value: certificate.certificateArn,
        });
    }
}

const outdir = 'cdktf.out';
const stackName = 'Workshop';
const app = new App({
    outdir,
});
const stack = new CdkWorkshop(app, stackName, {
    gridUUID: 'website',
    environmentName: 'prod',
    providerConfig: {
        region: 'us-east-1',
    },
    zoneId: 'Z09339061DF0IQA1CJMKQ', // terraconstructs.dev zone
    domain: 'aws-workshop.terraconstructs.dev',
});

new LocalBackend(stack, {
    path: `${stackName}.tfstate`,
});
app.synth();

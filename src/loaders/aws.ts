import aws from "aws-sdk"
import config from "../config/"

export default () => {

	aws.config.update({

		accessKeyId: config.AWS_ACCESS_KEY_ID,
	    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
	    region: config.AWS_REGION
	})

	const s3 = new aws.S3();
	const sns = new aws.SNS();
	const ses = new aws.SES();

	return { s3, sns, ses }
}
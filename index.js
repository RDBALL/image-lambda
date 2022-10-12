const AWS = require('aws-sdk');
let S3 = new AWS.S3();

exports.handler = async (event) => {

  const bucketName = event.Records[0].s3.bucket.name;
  const fileName = event.Records[0].s3.object.key;
  const fileSize = event.Records[0].s3.object.size;
  const bucketRecord = { Bucket: bucketName, Key: 'images.json' };

  try {
    const imgList = await S3.getObject(bucketRecord).promise();
    let imgMetadata = JSON.parse(imgList.Body.toString());
    imgMetadata.push({ name: fileName, size: fileSize });
    let imgMetadataBody = JSON.stringify(imgMetadata);
    await S3.putObject({ ...bucketRecord, Body: imgMetadataBody, ContentType: 'application/json' }).promise();
    console.log('Bucket object metadata ----->:', imgMetadata);
  } catch (error) {
    console.log(error);

    const newObject = {
      Bucket: bucketName,
      Key: 'images.json',
      Body: JSON.stringify([{ name: fileName, size: fileSize }]),
      ContentType: 'application/json',
    };
    await S3.putObject(newObject).promise();
  }
  const response = {
    statusCode: 200,
    body: JSON.stringify('Bucket list updated successfully'),
  };
  return response;
};
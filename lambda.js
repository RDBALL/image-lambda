const AWS = require('aws-sdk');
const S3 = new AWS.S3();


exports.handler = async (event) => {
  // goald: when I upload a new json file, I am going to add the images together
  console.log('HERE IS THE EVENT ------------>', event);

  // basic proof of life
  // let { testImage1, testImage2 } = event;
  // let result = testImage1 + testImage2;

  // console.log('HERE IS THE EVENT ------------>',result);

  // non dynamic way to get proof of life - grabbing images from s3
  // let bucketName = 'rdball-lab17bucket';
  // let key = 'images.json';

  // let images = await S3.getObject({Bucket: bucketName, Key: key}).promise();


  // let bucketName = event.Records[0].s3.bucket.name;
  // let key = event.Records[0].s3.object.key

  // let images = await S3.getObject({Bucket: bucketName, Key: key}).promise();



  // console log shows buffer in the body of the object
  // console.log('images ----->>>>>>:', images);

  //     let stringifiedImages = images.Body.toString();
  //     let parsedImages = JSON.parse(stringifiedImages);
  //     console.log('images ----->>>>>>:', parsedImages);

  //     let {testImage1, testImage2 } = parsedImages
  //     let result = testImage1 + testImage2;
  //     console.log('HERE IS THE RESULT', result);
  //     const response = {
  //         statusCode: 200,
  //         body: JSON.stringify(result),
  //     };
  //     return response;
  // };



  const AWS = require('aws-sdk');
  const S3 = new AWS.S3();

  let bucketName = event.Records[0].s3.bucket.name;
  let key = 'images.json';
  let startingBucketObj = {};

  try {
    let images = await S3.getObject({ Bucket: bucketName, Key: key }).promise();
    startingBucketObj = JSON.parse(images.Body.toString());
    console.log('Logging the starting bucket object ------>', startingBucketObj);
  } catch (error) {
    console.log('images not found', error);
  }

  const imgKey = event.Records[0].s3.object.key;
  const imgSize = event.Records[0].s3.object.size;

  let bucketRecord = {};
  bucketRecord[imgKey] = { imgKey, imgSize };

  let newBucketRecord = { ...startingBucketObj, ...bucketRecord };

  console.log(newBucketRecord);

  try {
    await S3.putObject({ Bucket: bucketName, Key: key, Body: JSON.stringify(newBucketRecord) }).promise();
  } catch (error) {
    console.log('images not found', error);
  }
}
const aws = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  S3_BUCKET_NAME,
} = process.env;

aws.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

const s3 = new aws.S3();

const deleteImage = async (filename) => {
  return s3
    .deleteObject({
      Bucket: S3_BUCKET_NAME,
      Key: filename,
    })
    .promise();
};

const getImage = async (filename) => {
  const imgObj = await s3
    .getObject({
      Bucket: S3_BUCKET_NAME,
      Key: filename,
    })
    .promise();
  const image = {
    buffer: imgObj.Body,
    title: filename,
  };
  return image;
};

const getAllImages = async () => {
  const data = await s3
    .listObjects({
      Bucket: S3_BUCKET_NAME,
    })
    .promise();
  const images = await Promise.all(
    data.Contents.map((object) => {
      return getImage(object.Key);
    })
  );
  return images;
};

const uploadImage = async (filename, buffer) => {
  return s3
    .putObject({
      Body: buffer,
      Bucket: S3_BUCKET_NAME,
      ContentType: 'image/jpeg',
      Key: filename,
    })
    .promise();
};

module.exports = {
  deleteImage,
  getAllImages,
  uploadImage,
};

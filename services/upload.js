const AWS = require("aws-sdk");
const multer = require("multer");
const multer3 = require("multer-s3");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_ACCESS_KEY,
  region: "ap-northeast-2",
});

const s3 = new AWS.S3();

const upload = multer({
  storage: multer3({
    s3: s3,
    bucket: "jwtbucket",
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

module.exports = upload;

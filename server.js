const express = require("express");
const AWS = require("aws-sdk");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const s3 = new AWS.S3({
  endpoint: process.env.R2_ENDPOINT,
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  signatureVersion: "v4",
  region: "auto",
});

app.post("/get-upload-url", async (req, res) => {
  const { name } = req.body;

  // Corrected template string syntax
  const fileKey = `uploads/${Date.now()}-${name}.jpg`;

  const params = {
    Bucket: process.env.R2_BUCKET,
    Key: fileKey,
    Expires: 60,
    ContentType: "image/jpeg",
  };

  try {
    const uploadURL = await s3.getSignedUrlPromise("putObject", params);
    // Corrected template string syntax
    const fileURL = `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET}/${fileKey}`;
    res.json({ uploadURL, fileURL });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not generate upload URL" });
  }
});

const PORT = process.env.PORT || 5000;
// Corrected template string syntax
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

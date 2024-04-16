const firebase = require('../config/firebase');
const { getDownloadURL } = require('firebase-admin/storage');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const uploadFile = (folder, file) => {
  return new Promise((resolve, reject) => {
    const filePath = `${folder}/${uuidv4() + path.extname(file.originalname)}`;
    const blob = firebase.bucket.file(filePath);

    const blobWriter = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype
      }
    });

    blobWriter.on('error', (err) => {
      reject(err)
    });

    blobWriter.on('finish', async () => {
      try {
        const downloadURL = await getDownloadURL(blob);
        resolve(downloadURL);
      } catch (err) {
        reject(err);
      }
    });

    blobWriter.end(file.buffer);
  })
}

module.exports = uploadFile;
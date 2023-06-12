const { S3Client, PutObjectCommand,GetObjectCommand } = require('@aws-sdk/client-s3')
const fs = require('fs')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')


const client = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_PUBLIC_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
  }
})

module.exports = {

    async uploadFile(name,file) {
        console.log(file);
        const stream = fs.createReadStream(file.tempFilePath)
        const uploadParams = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: name,
          Body: stream
        }
      
        const command = new PutObjectCommand(uploadParams)
        return await client.send(command)
      },
      
      async getFileURL(filename) {
        const command = new GetObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: filename
        })
      
        return await getSignedUrl(client, command, { expiresIn: 3600 })
      }
      
}
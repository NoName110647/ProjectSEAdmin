import multiparty from 'multiparty';
import {PutObjectAclCommand, S3Client} from '@aws-sdk/client-s3';
const  bucketName = 'art-nextjs-ecommerce'

export default async function handle(req, res) {
    const form = new multiparty.Form(); // ต้องใช้ new
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(500).json({ error: "Error parsing form data" });
        }
        if (!files || Object.keys(files).length === 0) {
            return res.status(400).json({ error: "No files uploaded" });
        }
        console.log(files);
        res.json({ message: "Upload successful", files });
    });
    const client = new S3Client({
        region: 'ap-southeast-2',
        credentials:{
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
    })
    for (const file of files.file){
        const ext = file.originalFilename.split('.').pop();
        
        await client.send(new PutObjectAclCommand({
            Bucket: bucketName,
            Key: ''
        }));
    }
    }
    
    

export const config = {
    api: { bodyParser: false },
};

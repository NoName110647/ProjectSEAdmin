// /api/upload.js
import multiparty from 'multiparty';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import fs from 'fs';
import mime from 'mime-types';
import { mongooseConnect } from "@/lib/mongoose"; // เชื่อมต่อกับ MongoDB
import { Product } from "@/models/Product"; // โมเดลของผลิตภัณฑ์

const bucketName = 'art-nextjs-ecommerce'; // ใช้ bucket name ของคุณ
const region = 'ap-southeast-2'; // ใช้ region ของคุณ

export default async function handle(req, res) {
  await mongooseConnect(); // เชื่อมต่อกับ MongoDB

  const form = new multiparty.Form();

  // ทำการ parse form data
  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

  console.log('Number of files:', files.file.length);

  // สร้าง Client สำหรับ AWS S3
  const client = new S3Client({
    region: region,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });

  const links = [];

  // อัปโหลดไฟล์ไปยัง S3
  for (const file of files.file) {
    const ext = file.originalFilename.split('.').pop();
    const newFilename = Date.now() + '.' + ext;

    await client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: newFilename,
      Body: fs.readFileSync(file.path),
      ACL: 'public-read',
      ContentType: mime.lookup(file.path),
    }));

    const link = `https://${bucketName}.s3.${region}.amazonaws.com/${newFilename}`;
    links.push(link);
  }

  return res.json({
    message: "Upload successful",
    links,
  });
}

export const config = {
  api: { bodyParser: false },
};

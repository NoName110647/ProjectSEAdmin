import * as db from "../../lib/mongoose";
import { Product } from "../../models/Product";
import multiparty from "multiparty";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import mime from "mime-types";

const bucketName = "art-nextjs-ecommerce";
const region = "ap-southeast-2"; // กำหนดภูมิภาค

export default async function handle(req, res) {
  await db.mongooseConnect();

  const { method } = req;

  switch (method) {
    case "POST":
      try {
        const { title, description, price } = req.body;
        const product = await Product.create({ title, description, price });
        return res.status(201).json(product); // Add return here
      } catch (error) {
        return res.status(500).json({ error: "Internal Server Error", details: error.message });
      }

    case "GET":
      if (req.query?.id) {
        const product = await Product.findOne({ _id: req.query.id });
        if (product) {
          return res.json(product);
        } else {
          return res.status(404).json({ error: "Product not found" });
        }
      } else {
        return res.json(await Product.find()); // ส่งข้อมูลทั้งหมด
      }

    case "PUT":
        const {title,description,price,images,category,properties,_id} = req.body;
        await Product.updateOne({_id}, {title,description,price,images,category,properties});
        res.json(true);

        const form = new multiparty.Form();
        form.parse(req, async (err, fields, files) => {
            if (err) {
            console.error("Error parsing form:", err);
            return res.status(500).json({ error: "Error processing form" });
            }

        const { title, description, price, _id } = fields;
        const client = new S3Client({
          region,
          credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
          },
        });

        // ตรวจสอบว่าไฟล์มาถึงหรือไม่
        if (files.image && files.image.length > 0) {
          const file = files.image[0];
          const ext = path.extname(file.originalFilename);
          const newFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}${ext}`;
          const fileStream = fs.createReadStream(file.path);

          // อัพโหลดไฟล์ไปยัง S3
          const uploadParams = {
            Bucket: bucketName,
            Key: newFileName,
            Body: fileStream,
            ContentType: mime.lookup(file.path) || "application/octet-stream",
            ACL: "public-read",
          };

          await client.send(new PutObjectCommand(uploadParams));

          const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${newFileName}`;

          // อัพเดตข้อมูลใน MongoDB
          await Product.updateOne(
            { _id: _id[0] },
            {
              title: title[0],
              description: description[0],
              price: parseInt(price[0]),
              image: fileUrl, // เพิ่ม URL ของรูปภาพที่อัพโหลดขึ้น S3
            }
          );
        } else {
          // หากไม่มีการอัพโหลดรูปภาพ
          await Product.updateOne(
            { _id: _id[0] },
            {
              title: title[0],
              description: description[0],
              price: parseInt(price[0]),
            }
          );
        }

        return res.json(true); // ส่งกลับว่าอัพเดตสำเร็จ
      });
      break;

    case "DELETE":
      if (req.query?.id) {
        await Product.deleteOne({ _id: req.query?.id });
        return res.json(true); // ลบสินค้าสำเร็จ
      }
      break;

    default:
      return res.status(405).json({ error: "Method Not Allowed" });
  }
}

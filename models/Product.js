import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ type: String }], // ใช้ array สำหรับเก็บหลาย URL ของภาพ
  });
  

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

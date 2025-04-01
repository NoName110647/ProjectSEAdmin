import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null }, // อ้างอิงไปยัง Category อื่น ๆ
});

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

export { Category };

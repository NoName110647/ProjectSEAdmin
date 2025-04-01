import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";

export default async function handle(req, res) {
  const { method } = req;

  await mongooseConnect();

  if (method === 'GET') {
    const categories = await Category.find().populate('parent');
    res.json(categories);
  }

  if (method === 'POST') {
    const { name, parentCategory } = req.body;
    const categoryDoc = await Category.create({
      name,
      parent: parentCategory === '0' ? null : parentCategory, // ถ้าไม่มี parent ให้เป็น null
    });
    res.json(categoryDoc);
  }

  if (method === 'PUT') {
    const { name, parentCategory, _id } = req.body;
    const categoryDoc = await Category.findByIdAndUpdate(
        _id, 
        { name, parent: parentCategory === '0' ? null : parentCategory }, 
        { new: true } // รีเทิร์นค่าใหม่หลังจากอัปเดต
    ).populate('parent');
    res.json(categoryDoc);
}
if (method === 'DELETE'){
    const {_id} = req.query;
    await Category.deleteOne({_id});
    res.json('ok');
}

}

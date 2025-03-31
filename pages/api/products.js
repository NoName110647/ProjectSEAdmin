import Products from "@/models/product";
import mongooseConnect from "@/lib/mongoose";

export default async function handle(req, res){
    const {method} = req;
    await mongooseConnect();
    if(method === 'POST'){
        const {title,description,price} = req.body;
        const productDoc = await Products.create({
            title,description,price,
        })
        res.json(productDoc);
    }
}
import * as db from "../../lib/mongoose";
import { Product } from "../../models/Product";

export default async function handle(req, res) {
    await db.mongooseConnect();

    const { method } = req;

    switch (method) {
        case "POST":
            try {
                const { title, description, price } = req.body;
                const product = await Product.create({ title, description, price });
                return res.status(201).json(product);
            } catch (error) {
                return res.status(500).json({ error: "Internal Server Error", details: error.message });
            }
        case "GET":
            try {
                const products = await Product.find();
                return res.status(200).json(products);
            } catch (error) {
                return res.status(500).json({ error: "Internal Server Error", details: error.message });
            }
        default:
            return res.status(405).json({ error: "Method Not Allowed" });
    }
}

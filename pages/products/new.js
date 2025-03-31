import Layout from "@/Components/Layout";

export default function NewProduct(){
    return(
        <Layout>
            <h1 >New Product</h1>
            <label>Product name</label>
            <input type="text" placeholder="Product name"/>
            <label>description</label>
            <textarea placeholder="description"></textarea>
            <label>price</label>
            <input type="number" placeholder="price"/>
        </Layout> 
    )
}
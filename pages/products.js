import Layout from "@/Components/Layout";
import Link from "next/link";

export default function Products(){
    return(
        <Layout>
            <Link className="bg-blue-900 text-white rounded-md pu-1 px-2" href={'/products/new'}>Add new Product</Link>
        </Layout>
    );
}
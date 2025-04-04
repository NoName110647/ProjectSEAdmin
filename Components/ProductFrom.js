import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function ProductForm({
    _id,
    title: existingTitle,
    description: existingDescription,
    price: existingPrice,
    images: existingImages,
}) {
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(existingPrice || '');
    const [images, setImages] = useState(existingImages || []);
    const [goToProducts, setGoToProducts] = useState(false);
    const router = useRouter();

    // ฟังก์ชันบันทึกข้อมูลผลิตภัณฑ์ (create/update)
    async function saveProduct(ev) {
        ev.preventDefault();
        const data = { title, description, price, images };

        try {
            if (_id) {
                // update
                await axios.put('/api/products', { ...data, _id });
            } else {
                // create
                await axios.post('/api/products', data);
            }
            setGoToProducts(true);  // ตั้งค่าให้ไปที่หน้าผลิตภัณฑ์หลังจากบันทึกสำเร็จ
        } catch (error) {
            console.error("Product save error:", error);
            alert("Error occurred while saving product. Please try again.");
        }
    }

    if (goToProducts) {
        router.push('/products');
    }

    // ฟังก์ชันอัปโหลดภาพ
    async function uploadImages(ev) {
        const files = ev.target?.files;
        if (files && files.length > 0) {
            console.log("Files received:", files);
            const data = new FormData();
            for (const file of files) {
                data.append('file', file);
            }
            try {
                const res = await axios.post('/api/upload', data);
                setImages(prevImages => [...prevImages, ...res.data.links]); // เพิ่ม URLs ของภาพใหม่
            } catch (error) {
                console.error("Upload error:", error);
                alert("Error occurred while uploading images. Please try again.");
            }
        } else {
            console.warn("No files selected");
            alert("Please select files to upload");
        }
    }

    return (
        <form onSubmit={saveProduct}>
            <label>Product name</label>
            <input
                type="text"
                placeholder="Product name"
                value={title}
                onChange={ev => setTitle(ev.target.value)}
            />

            <label>Photos</label>
            <div className="mb-2">
                <label className="w-32 h-32 bg-gray-200 
                    text-sm gap-1 text-gray-500 rounded-lg  
                    flex-col text-center flex items-center 
                    justify-center cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                    <div>Upload</div>
                    <input type="file" onChange={uploadImages} className="hidden" multiple />
                </label>

                {images.length > 0 && (
                    <div>
                        <h4>Uploaded Photos:</h4>
                        <ul>
                            {images.map((img, index) => (
                                <li key={index}>
                                    <img src={img} alt={`Uploaded ${index}`} className="w-20 h-20 object-cover" />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {images.length === 0 && <div>No Photos in this product</div>}
            </div>

            <label>Description</label>
            <textarea
                placeholder="Description"
                value={description}
                onChange={ev => setDescription(ev.target.value)}
            />

            <label>Price</label>
            <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={ev => setPrice(ev.target.value)}
            />

            <button type="submit" className="btn-primary">Save</button>
        </form>
    );
}

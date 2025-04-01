import Layout from "@/Components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2'; // ใช้ Swal ตรงๆ

function Categories() {

    const [editedCategory, setEditedCategory] = useState(null);
    const [name, setName] = useState('');
    const [parentCategory, setParentCategory] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    function fetchCategories() {
        axios.get('api/categories').then(result => {
            setCategories(result.data);
        }).catch(error => {
            console.error("Error fetching categories:", error);
        });
    }

    async function saveCategory(ev) {
        ev.preventDefault();
        const data = { name, parentCategory };

        if (editedCategory) {
            data._id = editedCategory._id;
            await axios.put('api/categories', data);
            setEditedCategory(null);
        } else {
            await axios.post('api/categories', data);
        }

        setName('');
        setParentCategory('');
        fetchCategories();
    }

    function editCategory(category) {
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id || '0');
    }

    function deleteCategory(category) {
        console.log("Delete button clicked for category:", category);  // เพิ่มการดีบัก
        Swal.fire({
            title: 'Are you sure?',
            text: `Do you really want to delete the category: ${category.name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
        }).then(async (result) => {
            // ตรวจสอบว่า user คลิก "Yes, delete it!"
            if (result.isConfirmed) {
                const {_id} = category;
                axios.delete('/api/categories?_id='+_id,{_id});
                fetchCategories();
            }
               
        });
    }
    

    return (
        <Layout>
            <h1>Categories</h1>
            <label>{editedCategory ? `Edit category: ${editedCategory.name}` : 'Create new category'}</label>
            <form onSubmit={saveCategory} className="flex gap-1">
                <input
                    className="mb-0"
                    type="text"
                    placeholder="Category name"
                    onChange={ev => setName(ev.target.value)}
                    value={name}
                />
                <select
                    className="mb-0"
                    onChange={ev => setParentCategory(ev.target.value)}
                    value={parentCategory}
                >
                    <option value="0">No parent category</option>
                    {categories.length > 0 && categories.map(category => (
                        <option key={category._id} value={category._id}>{category.name}</option>
                    ))}
                </select>
                <button type="submit" className="btn-primary py-1">Save</button>
            </form>

            <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Category Name</td>
                        <td>Parent category</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {categories.length > 0 && categories.map(category => (
                        <tr key={category._id}>
                            <td>{category.name}</td>
                            <td>{category.parent ? category.parent.name : 'No parent'}</td>
                            <td>
                                <button onClick={() => editCategory(category)} className="btn-primary mr-1">Edit</button>
                                <button
                                    onClick={() => deleteCategory(category)}
                                    className="btn-primary">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
}

export default Categories;

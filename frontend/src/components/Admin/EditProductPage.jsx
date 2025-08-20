import { useEffect, useState } from "react";
import { useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { updateProduct } from '../../redux/slices/productSlice'
import axios from 'axios'

const EditProductPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { id } = useParams()
    const [productData, setProductData] = useState({
        name: "",
        description: "",
        price: 0,
        countInStock: 0,
        sku: "",
        category: "",
        brand: "",
        sizes: [],
        colors: [],
        collections: "",
        material: "",
        gender: "",
        images: []
    });

    useEffect(() => {
        const fetchProduct = async () => {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`)
            const p = res.data
            setProductData({
                name: p.name || '',
                description: p.description || '',
                price: p.price || 0,
                countInStock: p.countInStock || 0,
                sku: p.sku || '',
                category: p.category || '',
                brand: p.brand || '',
                sizes: p.sizes || [],
                colors: p.colors || [],
                collections: p.collections || '',
                material: p.material || '',
                gender: p.gender || '',
                images: p.images || []
            })
        }
        if (id) fetchProduct()
    }, [id])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        console.log(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(updateProduct({ id, productData }))
        navigate('/admin/products')
    };

    return (
        <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md bg-white">
            <h2 className="text-xl font-semibold mb-6 text-left">Edit Product</h2>
            <form onSubmit={handleSubmit}>
                {/* Name */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={productData.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-gray-400"
                        required
                    />
                </div>

                {/* Description */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Description</label>
                    <textarea
                        name="description"
                        onChange={handleChange}
                        value={productData.description}
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-gray-400"
                        rows={4}
                        required
                    />
                </div>

                {/* Price */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={productData.price}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-gray-400"
                    />
                </div>

                {/* Count in Stock */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Count in Stock</label>
                    <input
                        type="number"
                        name="countInStock"
                        value={productData.countInStock}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-gray-400"
                    />
                </div>

                {/* SKU */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">SKU</label>
                    <input
                        type="text"
                        name="sku"
                        value={productData.sku}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-gray-400"
                    />
                </div>

                {/* Sizes */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Sizes (comma-separated)</label>
                    <input
                        type="text"
                        name="sizes"
                        value={productData.sizes.join(", ")}
                        onChange={(e) =>
                            setProductData({
                                ...productData,
                                sizes: e.target.value.split(",").map((size) => size.trim()),
                            })
                        }
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-gray-400"
                    />
                </div>

                {/* Colors */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Colors (comma-separated)</label>
                    <input
                        type="text"
                        name="colors"
                        value={productData.colors.join(", ")}
                        onChange={(e) =>
                            setProductData({
                                ...productData,
                                colors: e.target.value.split(",").map((color) => color.trim()),
                            })
                        }
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-gray-400"
                    />
                </div>

                {/* Image Upload */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Upload Image</label>
                    <div className="relative w-fit">
                        <label
                            htmlFor="file-upload"
                            className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors inline-block"
                        >
                            Choose File
                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </div>
                    <div className="flex gap-4 mt-4">
                        {productData.images.map((image, index) => (
                            <div key={index}>
                                <img
                                    src={image.url}
                                    alt={image.altText || "Product Image"}
                                    className="w-20 h-20 object-cover rounded-md shadow-md"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors cursor-pointer"
                >
                    Update Product
                </button>
            </form>
        </div>
    );
};

export default EditProductPage;
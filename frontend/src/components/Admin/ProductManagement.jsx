import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { fetchAdminProducts, deleteProduct } from '../../redux/slices/adminProductSlice'

const ProductManagement = () => {
    const dispatch = useDispatch()
    const { products, loading, error } = useSelector((state) => state.adminProducts)

    useEffect(() => {
        dispatch(fetchAdminProducts())
    }, [dispatch])

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete the product?")) {
            await dispatch(deleteProduct(id))
            dispatch(fetchAdminProducts())
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Product Management</h2>
            {loading && <div className="p-4">Loading...</div>}
            {error && <div className="p-4 text-red-600">{error}</div>}
            <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
                <table className="min-w-full text-sm text-gray-700">
                    <thead className="bg-gray-100 text-xs uppercase tracking-wider text-gray-600">
                        <tr>
                            <th className="py-4 px-6 text-left">Name</th>
                            <th className="py-4 px-6 text-left">Price</th>
                            <th className="py-4 px-6 text-left">SKU</th>
                            <th className="py-4 px-6 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(products || []).length > 0 ? (
                            products.map((product) => (
                                <tr
                                    key={product._id}
                                    className="border-t hover:bg-gray-50 transition duration-150"
                                >
                                    <td className="py-4 px-6 font-medium text-gray-900">
                                        {product.name}
                                    </td>
                                    <td className="py-4 px-6">
                                        ${product.price}
                                    </td>
                                    <td className="py-4 px-6">
                                        {product.sku}
                                    </td>
                                    <td className="py-4 px-6 flex gap-3">
                                        <Link
                                            to={`/admin/products/${product._id}/edit`}
                                            className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-md transition duration-150"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="bg-red-500 cursor-pointer hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-150"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="py-6 px-4 text-center text-gray-500">
                                    No products found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductManagement;

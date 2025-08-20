import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from 'axios'

const OrderDetailsPage = () => {
    const { id } = useParams();
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('userToken') || ''}` }
                })
                setOrderDetails(res.data)
            } catch (e) {
                setOrderDetails(null)
            }
        }
        if (id) load()
    }, [id]);

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Order Details</h2>
            {!orderDetails ? (
                <p className="text-red-500 text-lg">No order details found</p>
            ) : (
                <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8 space-y-8 border border-gray-200">
                    {/* Order Info */}
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-700">Order ID: {orderDetails._id}</h3>
                            <p className="text-gray-500">
                                {new Date(orderDetails.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex flex-col sm:items-end gap-2">
                            <span className={`px-4 py-1 text-sm rounded-full font-medium ${orderDetails.isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                {orderDetails.isPaid ? "Approved" : "Pending"}
                            </span>
                            {orderDetails.status === 'Cancelled' ? (
                                <span className="px-4 py-1 text-sm rounded-full font-medium bg-gray-200 text-gray-700">Cancelled</span>
                            ) : (
                                <span className={`px-4 py-1 text-sm rounded-full font-medium ${orderDetails.isDelivered ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                    {orderDetails.isDelivered ? "Delivered" : "Pending Delivery"}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Payment & Shipping Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <h4 className="text-lg font-semibold mb-2 text-gray-700">Payment Info</h4>
                            <p className="text-gray-600">Method: {orderDetails.paymentMethod}</p>
                            <p className="text-gray-600">Status: {orderDetails.isPaid ? "Paid" : "Unpaid"}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <h4 className="text-lg font-semibold mb-2 text-gray-700">Shipping Info</h4>
                            <p className="text-gray-600">Address: {orderDetails.shippingAddress ? `${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.country}` : 'N/A'}</p>
                        </div>
                    </div>

                    {/* Product List */}
                    <div>
                        <h4 className="text-xl font-semibold text-gray-700 mb-4">Products</h4>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                                <thead className="bg-gray-100 text-gray-700">
                                    <tr>
                                        <th className="text-left py-3 px-5">Name</th>
                                        <th className="text-left py-3 px-5">Unit Price</th>
                                        <th className="text-left py-3 px-5">Quantity</th>
                                        <th className="text-left py-3 px-5">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderDetails.orderItems.map((item) => (
                                        <tr key={item.productID} className="border-t hover:bg-gray-50">
                                            <td className="py-3 px-5 flex items-center gap-4">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-12 h-12 rounded-md object-cover"
                                                />
                                                <Link
                                                    to={`/product/${item.productID}`}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {item.name}
                                                </Link>
                                            </td>
                                            <td className="py-3 px-5">${item.price}</td>
                                            <td className="py-3 px-5">{item.quantity}</td>
                                            <td className="py-3 px-5 font-medium text-gray-800">${item.price * item.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Back to orders */}
                    <div>
                        <Link
                            to="/my-orders"
                            className="inline-block text-blue-600 hover:underline mt-2 text-sm"
                        >
                            ← Back to my orders
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderDetailsPage;
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllOrders, updateOrderStatus, deleteOrder } from '../../redux/slices/adminOrderSlice'

const OrderManagement = () => {
    const dispatch = useDispatch()
    const { orders, loading, error } = useSelector((state) => state.adminOrders)

    useEffect(() => {
        dispatch(fetchAllOrders())
    }, [dispatch])

    const handleStatusChange = async (orderId, status) => {
        await dispatch(updateOrderStatus({ id: orderId, status }))
        dispatch(fetchAllOrders())
    }

    const handleDelete = async (orderId) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            await dispatch(deleteOrder(orderId))
            dispatch(fetchAllOrders())
        }
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Order Management</h2>
            {loading && <div className="p-4">Loading...</div>}
            {error && <div className="p-4 text-red-600">{error}</div>}
            <div className="overflow-x-auto bg-white shadow border border-gray-200 rounded-lg">
                <table className="min-w-full text-sm text-left text-gray-700">
                    <thead className="bg-gray-100 text-xs uppercase">
                        <tr>
                            <th className="py-3 px-4">Order ID</th>
                            <th className="py-3 px-4">Customer</th>
                            <th className="py-3 px-4">Total Price</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(orders || []).length > 0 ? (
                            orders.map((order) => (
                                <tr key={order._id} className="border-t hover:bg-gray-50">
                                    <td className="py-4 px-4 font-medium text-gray-900 whitespace-nowrap">
                                        #{order._id}
                                    </td>
                                    <td className="p-4">{order.user?.name || '-'}</td>
                                    <td className="p-4">${order.totalPrice}</td>
                                    <td className="p-4">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            className="border border-gray-300 text-sm rounded-md p-2 w-full"
                                        >
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="p-4 flex gap-2">
                                        <button
                                            onClick={() => handleStatusChange(order._id, 'Delivered')}
                                            className="bg-green-500 text-white text-sm px-3 py-1.5 rounded cursor-pointer transition-all duration-150 hover:bg-green-600"
                                        >
                                            Mark as Delivered
                                        </button>
                                        <button
                                            onClick={() => handleDelete(order._id)}
                                            className="bg-red-500 text-white text-sm px-3 py-1.5 rounded cursor-pointer transition-all duration-150 hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-4 text-center text-gray-500">
                                    No Orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderManagement;

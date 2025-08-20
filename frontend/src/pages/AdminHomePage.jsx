import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders } from '../redux/slices/adminOrderSlice';
import { fetchAdminProducts } from '../redux/slices/adminProductSlice';

const AdminHomePage = () => {
    const dispatch = useDispatch();

    const {
        totalSales = 0,
        totalOrders = 0,
        orders = [],
        loading: ordersLoading,
        error: ordersError,
    } = useSelector((state) => state.adminOrders);

    const {
        products = [],
        loading: productsLoading,
        error: productsError,
    } = useSelector((state) => state.adminProducts);

    useEffect(() => {
        dispatch(fetchAllOrders());
        dispatch(fetchAdminProducts());
    }, [dispatch]);

    const recentOrders = (orders || [])
        .slice()
        .sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt))
        .slice(0, 5);

    return (
        <div className='max-w-7xl mx-auto p-6'>
            <h1 className='text-4xl font-extrabold text-gray-800 mb-8'>Admin Dashboard</h1>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                <div className='bg-white p-6 shadow-lg rounded-2xl transition-transform hover:scale-[1.02]'>
                    <h2 className='text-lg font-medium text-gray-500 mb-2'>Revenue</h2>
                    <p className='text-3xl font-semibold'>${Number(totalSales || 0).toLocaleString()}</p>
                </div>
                <div className='bg-white p-6 shadow-lg rounded-2xl transition-transform hover:scale-[1.02]'>
                    <h2 className='text-lg font-medium text-gray-500 mb-2'>Total Orders</h2>
                    <p className='text-3xl font-semibold'>{Number(totalOrders || 0).toLocaleString()}</p>
                    <Link to='/admin/orders' className='inline-block mt-2 text-sm text-blue-500 hover:underline'>Manage Orders</Link>
                </div>
                <div className='bg-white p-6 shadow-lg rounded-2xl transition-transform hover:scale-[1.02]'>
                    <h2 className='text-lg font-medium text-gray-500 mb-2'>Total Products</h2>
                    <p className='text-3xl font-semibold'>{Number(products?.length || 0).toLocaleString()}</p>
                    <Link to='/admin/products' className='inline-block mt-2 text-sm text-blue-500 hover:underline'>Manage Products</Link>
                </div>
            </div>

            <div className="mt-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Orders</h2>

                {(ordersLoading || productsLoading) && (
                    <div className="p-4">Loading...</div>
                )}
                {(ordersError || productsError) && (
                    <div className="p-4 text-red-600">{ordersError || productsError}</div>
                )}

                <div className="overflow-x-auto bg-white rounded-xl shadow-md">
                    <table className="min-w-full text-sm text-left text-gray-700">
                        <thead className="bg-gray-100 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="py-4 px-6">Order ID</th>
                                <th className="py-4 px-6">User</th>
                                <th className="py-4 px-6">Total Price</th>
                                <th className="py-4 px-6">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.length > 0 ? (
                                recentOrders.map((order) => (
                                    <tr key={order._id} className="border-t hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6 font-medium">{order._id}</td>
                                        <td className="py-4 px-6">{order?.user?.name || '-'}</td>
                                        <td className="py-4 px-6">${order.totalPrice}</td>
                                        <td className="py-4 px-6">{order.status}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="p-6 text-center text-gray-500">
                                        No recent orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminHomePage;
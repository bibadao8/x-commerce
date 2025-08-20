import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PayPalButton from "./PayPalButton";
import { useDispatch, useSelector } from 'react-redux';
import { createCheckout } from '../../redux/slices/checkoutSlice';
import axios from "axios";

const Checkout = () => {
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { cart, loading, error } = useSelector((state) => state.cart);  // Keeping error for use
    const { user } = useSelector((state) => state.auth);

    const [checkoutId, setCheckoutId] = useState(null);
    const [shippingAddress, setShippingAddress] = useState({
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        phone: "",
    });

    // Ensure cart is loaded before proceeding
    useEffect(() => {
        if (!cart || !cart.products || cart.products.length === 0) {
            navigate("/");
        }
    }, [cart, navigate]);

    const handleCreateCheckout = async (e) => {
        e.preventDefault();
        if (cart && cart.products.length > 0) {
            const res = await dispatch(
                createCheckout({
                    checkoutItems: cart.products,
                    shippingAddress,
                    paymentMethod: "Paypal",
                    totalPrice: cart.totalPrice,
                })
            );

            if (res.payload && res.payload._id) {
                setCheckoutId(res.payload._id); // Set checkout ID if checkout was successful
            }

        }
    }

    const handlePaymentSuccess = async (details) => {
        try {
            if (!checkoutId) {
                console.error("Missing checkoutId before marking as paid");
                return;
            }
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
                { paymentStatus: "paid", paymentDetails: details },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                }
            );
            if (response.status === 200) {
                await handleFinalizeCheckout(checkoutId)
            } else {
                console.error(error)
            }
        } catch (error) {
            console.error(error)
        };
    }

    const handleFinalizeCheckout = async (checkoutId) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                }
            );
            if (response.status === 200 || response.status === 201) {
                navigate("/order-confirmation")
            } else {
                console.error(error)
            }
        } catch (error) {
            console.error(error)
        }
    };

    if (loading) return <p>Loading cart ...</p>;
    if (error) return <p>Error: {error}</p>;  // Error is properly used here
    if (!cart || !cart.products || cart.products.length === 0) {
        return <p>Your cart is empty</p>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-16 px-8 tracking-tighter">
            {/* Left Section */}
            <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">Checkout</h2>
                <form onSubmit={handleCreateCheckout}>
                    <h3 className="text-lg mb-4 font-semibold text-gray-700">Contact Details</h3>
                    <div className="mb-6">
                        <label className="block text-gray-600 font-medium">Email</label>
                        <input type="email" value={user ? user.email : ""} className="w-full p-4 border rounded-lg bg-gray-100" disabled />
                    </div>
                    <h3 className="text-lg mb-4 font-semibold text-gray-700">Delivery Information</h3>
                    <div className="mb-6 grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-600">First Name</label>
                            <input type="text" value={shippingAddress.firstName} onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })} className="w-full p-4 border rounded-lg" required />
                        </div>
                        <div>
                            <label className="block text-gray-600">Last Name</label>
                            <input type="text" value={shippingAddress.lastName} onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })} className="w-full p-4 border rounded-lg" required />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-600">Address</label>
                        <input type="text" value={shippingAddress.address} onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })} className="w-full p-4 border rounded-lg" required />
                    </div>
                    <div className="mb-6 grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-600">City</label>
                            <input type="text" value={shippingAddress.city} onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })} className="w-full p-4 border rounded-lg" required />
                        </div>
                        <div>
                            <label className="block text-gray-600">Postal Code</label>
                            <input type="text" value={shippingAddress.postalCode} onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })} className="w-full p-4 border rounded-lg" required />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-600">Country</label>
                        <input type="text" value={shippingAddress.country} onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })} className="w-full p-4 border rounded-lg" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-600">Phone</label>
                        <input type="tel" value={shippingAddress.phone} onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })} className="w-full p-4 border rounded-lg" required />
                    </div>

                    <div className="mt-8">
                        {!checkoutId ? (
                            <button type="submit" className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-[#D8CFBC] hover:text-black cursor-pointer transition duration-300">
                                Continue to Payment
                            </button>
                        ) : (
                            <div>
                                <h3 className="text-md mb-4">PAY WITH PAYPAL</h3>
                                <PayPalButton amount={cart.totalPrice} onSuccess={handlePaymentSuccess} onError={(err) => alert("Payment failed. Try again!")} />
                            </div>
                        )}
                    </div>
                </form>
            </div>

            {/* Right Section */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h3>
                <div className="border-t py-4 mb-6">
                    {cart.products.map((product, index) => (
                        <div key={index} className="flex items-center justify-between py-4 border-b">
                            <div className="flex items-center">
                                <img src={product.image} alt={product.name} className="w-20 h-24 object-cover mr-6 rounded-lg shadow-md" />
                                <div>
                                    <h3 className="text-md font-medium">{product.name}</h3>
                                    <p className="text-gray-600">Size: {product.size}</p>
                                    <p className="text-gray-600">Color: {product.color}</p>
                                </div>
                            </div>
                            <p className="text-lg font-semibold">${product.price?.toLocaleString()}</p>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between items-center mb-6 text-md">
                    <p>Subtotal</p>
                    <p className="font-semibold">${cart.totalPrice?.toLocaleString()}</p>
                </div>
                <div className="flex justify-between items-center mb-6 text-md">
                    <p>Shipping</p>
                    <p className="font-semibold">Free</p>
                </div>
                <div className="flex justify-between font-semibold items-center text-lg mt-8 border-t pt-6">
                    <p>Total</p>
                    <p className="text-xl">${cart.totalPrice?.toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
};

export default Checkout;

import React from "react";

const checkout = {
  _id: "12323",
  createdAt: new Date(),
  checkoutItems: [
    {
      productId: "1",
      name: "Jacket",
      color: "black",
      size: "M",
      price: 150,
      quantity: 1,
      image: "https://picsum.photos/150?random=1",
    },
    {
      productId: "2",
      name: "T-Shirt",
      color: "black",
      size: "M",
      price: 120,
      quantity: 2,
      image: "https://picsum.photos/150?random=2",
    },
  ],
  shippingAddress: {
    address: "123 Fashion Street",
    city: "New York",
    country: "USA",
  },
};

const OrderConfirmationPage = () => {
  const calculateEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10);
    return orderDate.toLocaleDateString();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-white to-gray-100 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-12">
        Thank You For Your Order!
      </h1>

      {checkout && (
        <div className="p-6 bg-white rounded-lg shadow border">
          {/* Order Info */}
          <div className="flex justify-between items-start mb-12">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Order ID</h2>
              <p className="text-gray-600 mb-2">{checkout._id}</p>
              <h2 className="text-lg font-semibold text-gray-800">Order Date</h2>
              <p className="text-gray-600">
                {new Date(checkout.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-emerald-600">
                Estimated Delivery
              </p>
              <p className="text-gray-800 font-semibold text-lg">
                {calculateEstimatedDelivery(checkout.createdAt)}
              </p>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-4 mb-12">
            {checkout.checkoutItems.map((item) => (
              <div
                key={item.productId}
                className="flex items-center bg-gray-50 p-4 rounded-md shadow-sm"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md mr-6 border"
                />
                <div className="flex-grow">
                  <h4 className="text-lg font-semibold text-gray-800">
                    {item.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {item.color} | Size: {item.size}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-md text-gray-800 font-semibold">
                    ${item.price}
                  </p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Payment & Delivery Info */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Payment</h4>
              <p className="text-gray-600">PayPal</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                Delivery Address
              </h4>
              <p className="text-gray-600">{checkout.shippingAddress.address}</p>
              <p className="text-gray-600">
                {checkout.shippingAddress.city}, {checkout.shippingAddress.country}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmationPage;
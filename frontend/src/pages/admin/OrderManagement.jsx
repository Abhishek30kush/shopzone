import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaEye, FaShippingFast, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { fetchAllOrders, updateOrderStatus } from '../../slices/orderSlice';
import { toast } from 'react-toastify';

const OrderManagement = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }));
    toast.success('Order status updated');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Order Management</h1>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4">Order ID</th>
              <th className="text-left py-3 px-4">Customer</th>
              <th className="text-left py-3 px-4">Total</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Payment</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                </td>
              </tr>
            ) : orders?.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="border-t">
                  <td className="py-3 px-4">#{order._id.slice(-8).toUpperCase()}</td>
                  <td className="py-3 px-4">
                    <p className="font-medium">{order.shippingAddress?.fullName}</p>
                    <p className="text-sm text-gray-500">{order.shippingAddress?.city}</p>
                  </td>
                  <td className="py-3 px-4">₹{order.totalPrice.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.orderStatus)} border-0 cursor-pointer`}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 text-primary-500 hover:bg-primary-50 rounded"
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">Order Details</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-semibold mb-2">Order Information</h3>
                <p><strong>Order ID:</strong> #{selectedOrder._id.slice(-8).toUpperCase()}</p>
                <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                <p><strong>Total:</strong> ₹{selectedOrder.totalPrice.toFixed(2)}</p>
              </div>

              <div className="border-b pb-4">
                <h3 className="font-semibold mb-2">Customer Information</h3>
                <p><strong>Name:</strong> {selectedOrder.shippingAddress?.fullName}</p>
                <p><strong>Phone:</strong> {selectedOrder.shippingAddress?.phone}</p>
                <p><strong>Address:</strong> {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}</p>
              </div>

              <div className="border-b pb-4">
                <h3 className="font-semibold mb-2">Order Items</h3>
                {selectedOrder.orderItems?.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 py-2">
                    <img
                      src={item.image || '/placeholder.jpg'}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                    </div>
                    <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="font-semibold mb-2">Status</h3>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(selectedOrder.orderStatus)}`}>
                    {selectedOrder.orderStatus}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                    {selectedOrder.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;


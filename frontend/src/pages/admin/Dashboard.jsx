import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaUsers, FaShoppingCart, FaDollarSign, FaBox, FaChartLine } from 'react-icons/fa';
import { fetchOrderStats } from '../../slices/orderSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { orderStats, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderStats());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Orders',
      value: orderStats?.totalOrders || 0,
      icon: <FaShoppingCart className="text-2xl" />,
      color: 'bg-blue-500',
      textColor: 'text-blue-500',
    },
    {
      title: 'Total Sales',
      value: `₹${(orderStats?.totalSales || 0).toFixed(2)}`,
      icon: <FaDollarSign className="text-2xl" />,
      color: 'bg-green-500',
      textColor: 'text-green-500',
    },
    {
      title: 'Pending Orders',
      value: orderStats?.pendingOrders || 0,
      icon: <FaChartLine className="text-2xl" />,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-500',
    },
    {
      title: 'Delivered Orders',
      value: orderStats?.deliveredOrders || 0,
      icon: <FaBox className="text-2xl" />,
      color: 'bg-purple-500',
      textColor: 'text-purple-500',
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-full text-white`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sales Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Sales (Last 30 Days)</h2>
        {orderStats?.salesByDay?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Orders</th>
                  <th className="text-left py-3 px-4">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {orderStats.salesByDay.slice(-7).map((day, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4">{day._id}</td>
                    <td className="py-3 px-4">{day.count}</td>
                    <td className="py-3 px-4">₹{day.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No sales data available</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;


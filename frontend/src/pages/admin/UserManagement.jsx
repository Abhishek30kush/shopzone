import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaUser, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';
import { fetchAllUsers } from '../../slices/userSlice';

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">User Management</h1>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
          </div>
        ) : users?.length > 0 ? (
          users.map((user) => (
            <div key={user._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <FaUser className="text-primary-500 text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{user.name}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      user.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <p className="flex items-center text-gray-600">
                  <FaEnvelope className="mr-2" />
                  {user.email}
                </p>
                <p className="flex items-center text-gray-600">
                  <FaCalendarAlt className="mr-2" />
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>

              {user.address && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-500">
                    {user.address.street}, {user.address.city}
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No users found
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;


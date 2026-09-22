import React, { useState } from 'react';

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('customers');

  const users = [
    { id: '1', name: 'Nimal Silva', role: 'customer', phone: '+94 77 111 2222', status: 'Active' },
    { id: '2', name: 'Kamal Perera', role: 'worker', phone: '+94 71 333 4444', status: 'Active' },
    { id: '3', name: 'Saman Kumara', role: 'customer', phone: '+94 75 555 6666', status: 'Blocked' },
  ];

  const filteredUsers = users.filter(u => u.role === activeTab);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">User Directory</h2>
      
      <div className="flex space-x-4 mb-6 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('customers')} 
          className={`pb-2 border-b-2 font-medium ${activeTab === 'customers' ? 'border-primary text-primary' : 'border-transparent text-gray-500'}`}>
          Customers
        </button>
        <button 
          onClick={() => setActiveTab('workers')} 
          className={`pb-2 border-b-2 font-medium ${activeTab === 'workers' ? 'border-primary text-primary' : 'border-transparent text-gray-500'}`}>
          Workers
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between">
          <input type="text" placeholder="Search by name or phone..." className="border border-gray-300 rounded px-3 py-1.5 text-sm w-64" />
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Phone</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{user.name}</td>
                <td className="px-6 py-4">{user.phone}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${user.status === 'Active' ? 'bg-green-100 text-success' : 'bg-red-100 text-danger'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-info hover:underline mr-4">View Profile</button>
                  {user.status === 'Active' ? (
                    <button className="text-danger hover:underline">Block</button>
                  ) : (
                    <button className="text-success hover:underline">Unblock</button>
                  )}
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;

import React from 'react';

const Disputes = () => {
  const disputes = [
    { id: 'D-101', bookingId: 'B-402', raisedBy: 'Customer', reason: 'Worker did not arrive on time', status: 'open', date: 'Oct 14, 2026' },
    { id: 'D-102', bookingId: 'B-305', raisedBy: 'Worker', reason: 'Customer refusing to pay agreed amount', status: 'investigating', date: 'Oct 12, 2026' }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dispute Resolution Center</h2>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 font-medium">Dispute ID</th>
              <th className="px-6 py-3 font-medium">Raised By</th>
              <th className="px-6 py-3 font-medium">Reason</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {disputes.map(dispute => (
              <tr key={dispute.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{dispute.id}</td>
                <td className="px-6 py-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs">{dispute.raisedBy}</span></td>
                <td className="px-6 py-4 text-gray-600 truncate max-w-xs">{dispute.reason}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${dispute.status === 'open' ? 'bg-red-100 text-danger' : 'bg-orange-100 text-warning'}`}>
                    {dispute.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-primary hover:underline font-medium">Review Case</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Disputes;

import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ClientListing: React.FC = () => {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const data = await api.get('/api/partners');
        setPartners(data);
      } catch (error) {
        console.error('Error fetching partners:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="w-full  p-6  rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Partner List</h2>
      <p className="mb-4 text-gray-600">View onboarded partners and their details.</p>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Partner Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Number</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Agreement</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PAN</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {partners.map((partner) => (
            <tr key={partner.id}>
              <td className="px-6 py-4 whitespace-nowrap">{partner.partnerName}</td>
              <td className="px-6 py-4 whitespace-nowrap">{partner.type}</td>
              <td className="px-6 py-4 whitespace-nowrap">{partner.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">{partner.contactNumber}</td>
              <td className="px-6 py-4 whitespace-nowrap">{partner.dateOfAgreement}</td>
              <td className="px-6 py-4 whitespace-nowrap">{partner.pan}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button className="text-blue-500 hover:text-blue-700">Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientListing;
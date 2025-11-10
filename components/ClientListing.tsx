// import React, { useState, useEffect } from 'react';
// import api from '../services/api';

// const ClientListing: React.FC = () => {
//   const [partners, setPartners] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const fetchPartners = async () => {
//       try {
//         const data = await api.get('/api/partners');
//         setPartners(data);
//       } catch (error) {
//         console.error('Error fetching partners:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPartners();
//   }, []);

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="w-full  p-6  rounded-lg">
//       <h2 className="text-2xl font-bold mb-4">Partner List</h2>
//       <p className="mb-4 text-gray-600">View onboarded partners and their details.</p>
//       <table className="min-w-full divide-y divide-gray-200">
//         <thead className="bg-gray-50">
//           <tr>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Partner Name</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Number</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Agreement</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PAN</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-gray-200">
//           {partners.map((partner) => (
//             <tr key={partner.id}>
//               <td className="px-6 py-4 whitespace-nowrap">{partner.partnerName}</td>
//               <td className="px-6 py-4 whitespace-nowrap">{partner.type}</td>
//               <td className="px-6 py-4 whitespace-nowrap">{partner.email}</td>
//               <td className="px-6 py-4 whitespace-nowrap">{partner.contactNumber}</td>
//               <td className="px-6 py-4 whitespace-nowrap">{partner.dateOfAgreement}</td>
//               <td className="px-6 py-4 whitespace-nowrap">{partner.pan}</td>
//               <td className="px-6 py-4 whitespace-nowrap">
//                 <button className="text-blue-500 hover:text-blue-700">Edit</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ClientListing;

import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Pagination, Search } from "@hdfclife-insurance/one-x-ui";
 
const ClientListing: React.FC = () => {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editPartner, setEditPartner] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
 
  // pagination state
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalElements, setTotalElements] = useState<number>(0);
 
  // search state
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
 
  // 🔹 Debounce search input (delay API calls until user stops typing)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0); // reset to first page when search changes
    }, 500); // 500ms delay
 
    return () => {
      clearTimeout(handler);
    };
  }, [search]);
 
  // fetch paginated data
  useEffect(() => {
    const fetchPartners = async () => {
      setLoading(true);
      try {
        const res = await api.get(
          `/api/partner?page=${page}&size=${pageSize}&query=${encodeURIComponent(debouncedSearch)}`
        );
        const data = res.data ?? res;
 
        setPartners(data.content || []);
        setTotalElements(data.totalElements || 0);
      } catch (error) {
        console.error("Error fetching partners:", error);
      } finally {
        setLoading(false);
      }
    };
 
    fetchPartners();
  }, [page, pageSize, debouncedSearch]);
 
  const handleEdit = (partner: any) => {
    setEditPartner({ ...partner });
    setErrors({});
  };
 
  // ✅ Validation logic remains same...
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!editPartner.partnerName || editPartner.partnerName.trim().length < 2) {
      newErrors.partnerName = "Partner name must be at least 2 characters.";
    }
    if (!["Individual", "Corporate"].includes(editPartner.type)) {
      newErrors.type = "Type must be either Individual or Corporate.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!editPartner.email || !emailRegex.test(editPartner.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!editPartner.contactNumber || !phoneRegex.test(editPartner.contactNumber)) {
      newErrors.contactNumber = "Contact number must be a 10-digit number.";
    }
    if (!editPartner.dateOfAgreement) {
      newErrors.dateOfAgreement = "Date of agreement is required.";
    }
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!editPartner.pan || !panRegex.test(editPartner.pan)) {
      newErrors.pan = "Enter a valid PAN (e.g., ABCDE1234F).";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
 
    try {
      const updatedRes = await api.patch(`/api/partner/${editPartner.id}`, {
        partnerName: editPartner.partnerName,
        type: editPartner.type,
        email: editPartner.email,
        contactNumber: editPartner.contactNumber,
        dateOfAgreement: editPartner.dateOfAgreement,
        pan: editPartner.pan,
      });
 
      const updatedPartner = updatedRes.data ?? updatedRes;
 
      // update in current page only
      setPartners((prev) =>
        prev.map((p) => (p.id === updatedPartner.id ? updatedPartner : p))
      );
      setEditPartner(null);
    } catch (error) {
      console.error("Error updating partner:", error);
    }
  };
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditPartner({ ...editPartner, [name]: value });
  };
 
  if (loading) return <div>Loading...</div>;
 
  return (
    <div className="w-full p-4 sm:p-6 rounded-lg">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Partner List</h2>
      {/* Search */}
      <div className="mb-4">
        <Search
          placeholder="Search by name, email, PAN..."
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        />
      </div>
      {/* Desktop / Tablet Table */}
      <div className="hidden md:block">
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wide">Partner Name</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wide">Type</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wide">Email</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wide">Contact Number</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wide">Date of Agreement</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wide">PAN</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {partners.length > 0 ? (
                partners.map((partner) => (
                  <tr key={partner.id} className="hover:bg-indigo-50/40 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-800">{partner.partnerName}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{partner.type}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">{partner.email}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{partner.contactNumber}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{partner.dateOfAgreement}</td>
                    <td className="px-4 py-3 whitespace-nowrap font-mono text-xs">{partner.pan}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                        onClick={() => handleEdit(partner)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500 text-sm">No results found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {partners.length > 0 ? (
          partners.map((p) => (
            <div key={p.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold text-gray-800">{p.partnerName}</h3>
                  <p className="text-xs uppercase tracking-wide text-indigo-600 font-medium">{p.type}</p>
                </div>
                <button
                  className="text-indigo-600 text-sm font-medium"
                  onClick={() => handleEdit(p)}
                >Edit</button>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <span className="text-gray-500">Email</span><span className="truncate text-gray-700" title={p.email}>{p.email}</span>
                <span className="text-gray-500">Contact</span><span className="text-gray-700">{p.contactNumber}</span>
                <span className="text-gray-500">Agreement</span><span className="text-gray-700">{p.dateOfAgreement}</span>
                <span className="text-gray-500">PAN</span><span className="text-gray-700 font-mono">{p.pan}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 text-sm border border-dashed rounded-lg">No results found</div>
        )}
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-center w-full mt-6">
        <Pagination
          count={totalElements}
          page={page + 1}
          pageSize={pageSize}
          onPageChange={(details) => setPage(details.page - 1)}
          onPageSizeChange={(details) => {
            setPageSize(details.pageSize);
            setPage(0);
          }}
          siblingCount={1}
        />
      </div>
      {/* Edit Partner Modal */}
      {editPartner && (
        <div className="fixed inset-0 z-50 bg-gray-800/40 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6">
          <div className="bg-white w-full md:w-[560px] max-h-[90vh] overflow-y-auto rounded-t-2xl md:rounded-lg shadow-xl p-5 md:p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg md:text-xl font-bold">Edit Partner</h3>
              <button
                className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={() => setEditPartner(null)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              {/* Partner Name */}
              <div>
                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">Partner Name</label>
                <input
                  type="text"
                  name="partnerName"
                  value={editPartner.partnerName}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
                {errors.partnerName && <p className="text-red-500 text-xs mt-1">{errors.partnerName}</p>}
              </div>
              {/* Type */}
              <div>
                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">Type</label>
                <select
                  name="type"
                  value={editPartner.type}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                >
                  <option value="Individual">Individual</option>
                  <option value="Corporate">Corporate</option>
                </select>
                {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
              </div>
              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editPartner.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              {/* Contact Number */}
              <div>
                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">Contact Number</label>
                <input
                  type="text"
                  name="contactNumber"
                  value={editPartner.contactNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
                {errors.contactNumber && <p className="text-red-500 text-xs mt-1">{errors.contactNumber}</p>}
              </div>
              {/* Date of Agreement */}
              <div>
                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">Date of Agreement</label>
                <input
                  type="date"
                  name="dateOfAgreement"
                  value={editPartner.dateOfAgreement}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
                {errors.dateOfAgreement && <p className="text-red-500 text-xs mt-1">{errors.dateOfAgreement}</p>}
              </div>
              {/* PAN */}
              <div>
                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">PAN</label>
                <input
                  type="text"
                  name="pan"
                  value={editPartner.pan}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
                {errors.pan && <p className="text-red-500 text-xs mt-1">{errors.pan}</p>}
              </div>
              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                <button
                  type="button"
                  className="w-full sm:w-auto bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 text-sm"
                  onClick={() => setEditPartner(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 text-sm"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
 
export default ClientListing;
import React, { useState } from 'react';
import api from '../services/api';
import toast, { Toaster } from 'react-hot-toast'; // <-- import toast

interface FormData {
  partnerName: string;
  type: string;
  email: string;
  contactNumber: string;
  pan: string;
  gst: string;
  contactAddress: string;
  dateOfAgreement: string;
}
 
const ClientOnboarding: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    partnerName: '',
    type: 'Corporate',
    email: '',
    contactNumber: '',
    pan: '',
    gst: '',
    contactAddress: '',
    dateOfAgreement: ''
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitting, setSubmitting] = useState(false);
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // clear error on change
  };
 
  const validate = () => {
    const newErrors: Partial<FormData> = {};
    if (!formData.partnerName.trim()) newErrors.partnerName = 'Partner Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Contact Number is required';
    else if (!/^\d{10}$/.test(formData.contactNumber)) newErrors.contactNumber = 'Contact Number must be 10 digits';
    if (!formData.pan.trim()) newErrors.pan = 'PAN is required';
    else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) newErrors.pan = 'Invalid PAN format';
    if (!formData.gst.trim()) newErrors.gst = 'GST is required';
    else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gst)) newErrors.gst = 'Invalid GST format';
    if (!formData.contactAddress.trim()) newErrors.contactAddress = 'Address is required';
    if (!formData.dateOfAgreement) newErrors.dateOfAgreement = 'Date of Agreement is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 
  const extractErrorMessage = (err: any): string => {
    if (!err) return 'Failed to register partner.';
    
    const data = err.data || err.response?.data || {};
    return (
      data.message ||
      data.error ||
      (typeof data === 'string' ? data : '') ||
      err.message ||
      'Failed to register partner.'
    );
  };
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
 
    const payload = {
      ...formData,
      pan: formData.pan.toUpperCase().trim(),
      gst: formData.gst.toUpperCase().trim(),
      partnerName: formData.partnerName.trim(),
      contactNumber: formData.contactNumber.trim(),
    };
 
    try {
      setSubmitting(true);
      const response = await api.post('/api/partner', payload);
      const successMsg = (response && typeof response === 'object' && response.message) ? response.message : 'Partner registered successfully!';
      toast.success(successMsg);
      setFormData({
        partnerName: '',
        type: 'Corporate',
        email: '',
        contactNumber: '',
        pan: '',
        gst: '',
        contactAddress: '',
        dateOfAgreement: ''
      });
      setErrors({});
    } catch (error: any) {
      const data = error?.data || error?.response?.data || {};
      
      const fieldErrors = data.fieldErrors || data.errors;
      if (fieldErrors && typeof fieldErrors === 'object') {
        const updated: any = { ...errors };
        Object.entries(fieldErrors).forEach(([field, msg]) => {
          if (typeof msg === 'string') {
            updated[field as keyof FormData] = msg;
            toast.error(msg);
          }
        });
        setErrors(updated);
      }
    
      if (Array.isArray(data) && data.length) {
        data.forEach((m: any) => { if (typeof m === 'string') toast.error(m); });
      }
      // If no specific field errors triggered a toast, show a general one
      if (!(fieldErrors && Object.keys(fieldErrors).length) && !(Array.isArray(data) && data.length)) {
        toast.error(extractErrorMessage(error));
      }
    } finally {
      setSubmitting(false);
    }
  };
 
 
  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 bg-white shadow-md rounded-lg">
      <Toaster position="top-center" reverseOrder={false} />
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">Partner Registration</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Partner Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-black">Partner Name</label>
          <input
            type="text"
            autoFocus
            name="partnerName"
            value={formData.partnerName}
            onChange={handleChange}
            className={`mt-1 block w-full border ${errors.partnerName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm text-black`}
            required
          />
          {errors.partnerName && <p className="text-red-500 text-sm mt-1">{errors.partnerName}</p>}
        </div>
        {/* Partner Type */}
        <div>
          <label className="block text-sm font-medium text-black">Partner Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm text-black"
          >
            <option value="Corporate">Corporate</option>
            <option value="Individual">Individual</option>
          </select>
        </div>
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-black">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`mt-1 block w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm text-black`}
            required
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        {/* Contact Number */}
        <div>
          <label className="block text-sm font-medium text-black">Contact Number</label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className={`mt-1 block w-full border ${errors.contactNumber ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm text-black`}
              required
            />
            {errors.contactNumber && <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>}
        </div>
        {/* PAN */}
        <div>
          <label className="block text-sm font-medium text-black">PAN Number</label>
          <input
            type="text"
            name="pan"
            value={formData.pan}
            onChange={handleChange}
            className={`mt-1 block w-full border ${errors.pan ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm text-black`}
            required
          />
          {errors.pan && <p className="text-red-500 text-sm mt-1">{errors.pan}</p>}
        </div>
        {/* GST */}
        <div>
          <label className="block text-sm font-medium text-black">GST Number</label>
          <input
            type="text"
            name="gst"
            value={formData.gst}
            onChange={handleChange}
            className={`mt-1 block w-full border ${errors.gst ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm text-black`}
            required
          />
          {errors.gst && <p className="text-red-500 text-sm mt-1">{errors.gst}</p>}
        </div>
        {/* Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-black">Contact Address</label>
          <input
            type="text"
            name="contactAddress"
            value={formData.contactAddress}
            onChange={handleChange}
            className={`mt-1 block w-full border ${errors.contactAddress ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm text-black`}
            required
          />
          {errors.contactAddress && <p className="text-red-500 text-sm mt-1">{errors.contactAddress}</p>}
        </div>
        {/* Date of Agreement */}
        <div>
          <label className="block text-sm font-medium text-black">Date of Agreement</label>
          <input
            type="date"
            name="dateOfAgreement"
            value={formData.dateOfAgreement}
            onChange={handleChange}
            className={`mt-1 block w-full border ${errors.dateOfAgreement ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm text-black`}
            required
          />
          {errors.dateOfAgreement && <p className="text-red-500 text-sm mt-1">{errors.dateOfAgreement}</p>}
        </div>
        {/* Submit */}
        <div className="md:col-span-2 mt-2">
          <button
            type="submit"
            disabled={submitting}
            className={`w-full text-white py-2.5 px-4 rounded-md transition-colors text-sm font-medium ${submitting ? 'bg-red-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}`}
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};
 
export default ClientOnboarding;

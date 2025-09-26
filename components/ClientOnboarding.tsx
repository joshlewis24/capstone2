import React, { useState } from 'react';
import api from '../services/api';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await api.post('/partner-registration', formData);
      console.log('Success:', response.data);
      alert('Partner registered successfully!');
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
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to register partner.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Partner Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/** Partner Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Partner Name</label>
          <input
            type="text"
            name="partnerName"
            value={formData.partnerName}
            onChange={handleChange}
            className={`mt-1 block w-full border ${errors.partnerName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}
            required
          />
          {errors.partnerName && <p className="text-red-500 text-sm mt-1">{errors.partnerName}</p>}
        </div>

        {/** Partner Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Partner Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          >
            <option value="Corporate">Corporate</option>
            <option value="Individual">Individual</option>
          </select>
        </div>

        {/** Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`mt-1 block w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}
            required
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/** Contact Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Number</label>
          <input
            type="text"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            className={`mt-1 block w-full border ${errors.contactNumber ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}
            required
          />
          {errors.contactNumber && <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>}
        </div>

        {/** PAN */}
        <div>
          <label className="block text-sm font-medium text-gray-700">PAN Number</label>
          <input
            type="text"
            name="pan"
            value={formData.pan}
            onChange={handleChange}
            className={`mt-1 block w-full border ${errors.pan ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}
            required
          />
          {errors.pan && <p className="text-red-500 text-sm mt-1">{errors.pan}</p>}
        </div>

        {/** GST */}
        <div>
          <label className="block text-sm font-medium text-gray-700">GST Number</label>
          <input
            type="text"
            name="gst"
            value={formData.gst}
            onChange={handleChange}
            className={`mt-1 block w-full border ${errors.gst ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}
            required
          />
          {errors.gst && <p className="text-red-500 text-sm mt-1">{errors.gst}</p>}
        </div>

        {/** Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Address</label>
          <input
            type="text"
            name="contactAddress"
            value={formData.contactAddress}
            onChange={handleChange}
            className={`mt-1 block w-full border ${errors.contactAddress ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}
            required
          />
          {errors.contactAddress && <p className="text-red-500 text-sm mt-1">{errors.contactAddress}</p>}
        </div>

        {/** Date of Agreement */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Agreement</label>
          <input
            type="date"
            name="dateOfAgreement"
            value={formData.dateOfAgreement}
            onChange={handleChange}
            className={`mt-1 block w-full border ${errors.dateOfAgreement ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}
            required
          />
          {errors.dateOfAgreement && <p className="text-red-500 text-sm mt-1">{errors.dateOfAgreement}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ClientOnboarding;

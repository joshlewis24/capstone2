import axios from 'axios';

const dummyPartners = [
  {
    id: 123,
    partnerName: "John Smith",
    type: "Individual",
    email: "john.smith@example.com",
    contactNumber: "9876543210",
    dateOfAgreement: "2024-04-10",
    pan: "ABCDE1234F",
  },
  {
    id: 124,
    partnerName: "Acme Corporation",
    type: "Corporate",
    email: "contact@acme.example.com",
    contactNumber: "9986776655",
    dateOfAgreement: "2024-04-08",
    pan: "FGHIJ5678K",
  },
  {
    id: 125,
    partnerName: "Jane Doe",
    type: "Individual",
    email: "jane.doe@example.com",
    contactNumber: "9123456789",
    dateOfAgreement: "2024-04-05",
    pan: "KLMNO9012P",
  },
  {
    id: 126,
    partnerName: "Global Industries",
    type: "Corporate",
    email: "info@global.example.com",
    contactNumber: "9234567890",
    dateOfAgreement: "2024-04-02",
    pan: "PQRST1234U",
  },
];

const api = axios.create({
  baseURL: 'https://your-api-endpoint.com',
});

export default {
  post: async (url: string, data: any) => {
    console.log(data);
    const response = await api.post(url, data);
    return response.data;
  },
  get: async (url: string) => {
    if (url === '/api/partners') {
      return dummyPartners;
    }
    const idMatch = url.match(/\/api\/partners\/(\d+)/);
    if (idMatch) {
      const id = parseInt(idMatch[1], 10);
      const partner = dummyPartners.find(p => p.id === id);
      if (partner) {
        return partner;
      } else {
        throw new Error('Partner not found');
      }
    }
    const response = await api.get(url);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to fetch partner details');
    }
  },
};
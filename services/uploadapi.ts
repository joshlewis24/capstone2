import axios from 'axios';

const uploadApi = axios.create({
  baseURL: 'http://192.168.254.54:8085', // Backend IP and port
  // Do not set 'Content-Type'; browser will handle it for file uploads
});

export default {
  // POST method (file upload)
  post: async (url: string, data: any, options?: any) => {
    try {
      const response = await uploadApi.post(url, data, options);
      console.log('Upload success:', response);
      return response.data;
    } catch (error: any) {
      console.error('Upload API POST Error:', error?.response || error?.message);
      throw error;
    }
  },

  // GET method (fetch partner configs / JSON)
  get: async (url: string) => {
    try {
      const response = await uploadApi.get(url);
      console.log('GET success:', response);
      return response.data;
    } catch (error: any) {
      console.error('Upload API GET Error:', error?.response || error?.message);
      throw error;
    }
  },

  // DOWNLOAD method (file download)
  download: async (url: string, fileName?: string) => {
    try {
      const response = await uploadApi.get(url, { responseType: 'blob' });
      // Create a link element and trigger download
      const blob = new Blob([response.data]);
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName || 'download.xlsx';
      link.click();
      window.URL.revokeObjectURL(link.href);
      console.log('Download success');
    } catch (error: any) {
      console.error('Download API Error:', error?.response || error?.message);
      throw error;
    }
  },
};

import { create } from 'zustand';
import { request } from './request.js';

const useStatusStore = create((set) => ({
  statuses: {},
  isLoading: false,
  error: null,
  fetchStatus: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await request({
        url: `/api/status`,
        method: 'GET',
      });

      if (res.code !== 200) {
        const error = new Error(res.msg || '获取流程状态失败');
        error.code = res.code;
        throw error;
      }

      set({ statuses: res.data, isLoading: false });
      return res.data;
      
    } catch (error) {
      set({ error: { message: error.message, code: error.code }, isLoading: false });
      console.error('statusStore: fetchStatus fail.', error);
      throw error;
    }
  },
}));

export default useStatusStore;
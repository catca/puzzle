import axios from 'libs/axios';
import { useQuery } from 'react-query';

export const useNotice = (user: UserInfo | null) => {
  const { data, refetch } = useQuery(['notice'], () => getNotice(), {
    onError: (error: Error) => {
      alert(error.message);
    },
  });

  const getNotice = async () => {
    try {
      if (user === null) return [];
      const res = await axios.get(`/api/users/notices`);
      return res.data.notice;
    } catch (error) {
      throw new Error('error');
    }
  };

  return { notice: data, refetchNotice: refetch };
};

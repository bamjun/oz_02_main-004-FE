import { GuestBookListType } from '@/types/guestBookType';
import { axios } from './instance';
import { useQuery } from '@tanstack/react-query';

const fetchGuestBook = async (user_id: number) => {
  const response = await axios.get<GuestBookListType[]>(`guestbook/comments/${user_id}`);
  console.log(response.data);
  return response.data;
};

export const useGetGuestBook = (user_id: number) => {
  return useQuery({
    queryKey: ['guestBook', user_id],
    queryFn: () => fetchGuestBook(user_id),
  });
};

import { PostType } from '@/types/calendarType';
import { axios } from './instance';
import { useQuery } from '@tanstack/react-query';

const fetchPostList = async () => {
  const response = await axios.get<PostType[]>(`posts/`);
  console.log(response.data);
  return response.data;
};

export const useGetPostsList = () => {
  return useQuery({
    queryKey: ['postsList'],
    queryFn: () => fetchPostList(),
  });
};

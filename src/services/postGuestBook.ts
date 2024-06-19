import { postGuestBookProps } from '@/types/guestBookType';
import { axios } from './instance';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const fetchPostGuestBook = async (new_comment: postGuestBookProps) => {
  const commentData = JSON.stringify(new_comment);
  const response = await axios.post(`guestbook/comments/a-test/`, commentData);
  console.log(response.data);
  return response.data;
};

export const usePostGuestBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ user_id, content, guestbook_user }: postGuestBookProps) =>
      fetchPostGuestBook({ user_id, content, guestbook_user }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guestBook'] });
    },
  });
};

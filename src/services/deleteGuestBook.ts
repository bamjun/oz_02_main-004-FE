import { axios } from './instance';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteGuestBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (comment_id: number) => axios.post(`guestbook/comments/delete/${comment_id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guestBook'] });
    },
  });
};

import { axios } from '@/services/instance';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

export type TodoItem = {
  id: number;
  created_at: string;
  updated_at: string;
  todo_item: string;
  done: boolean;
  post: number;
};

const fetchTodos = async (postId: number | undefined) => {
  if (postId !== undefined) {
    const response = await axios.get<TodoItem[]>(`posts/todo/${postId}`);
    return response.data;
  }
};
export const useTodos = (postId: number | undefined) => {
  return useQuery({
    queryKey: ['todolist', postId],
    queryFn: () => fetchTodos(postId),
  });
};

export const useDeleteTodo = (postId: number | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => axios.delete(`posts/todo/${postId}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todolist', postId] });
    },
  });
};

export const useCreateTodo = (postId: number | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: TodoItem) => axios.post(`posts/todo/${postId}`, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todolist', postId] });
    },
  });
};

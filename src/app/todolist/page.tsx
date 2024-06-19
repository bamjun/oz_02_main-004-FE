'use client';
import NavBottom from '@/components/NavBottom';
import Modal from '@/components/todo/Modal';
import Mood from '@/components/todo/Mood';
import MusicInput from '@/components/todo/MusicInput';
import Timer from '@/components/todo/Timer';
import ToDoInsert from '@/components/todo/ToDoInsert';
import ToDoListItem from '@/components/todo/ToDoListItem';
import { useTodos, useDeleteTodo, useCreateTodo, TodoItem } from '@/hooks/useTodo';
import { axios } from '@/services/instance';
import React, { useCallback, useEffect, useState } from 'react';
import { IoMusicalNotesOutline } from 'react-icons/io5';

export interface TodoType {
  id: number;
  created_at: string;
  updated_at: string;
  todo_item: string;
  done: boolean;
  post: number;
}

function Page() {
  // const [todos, setTodos] = useState<TodoType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalIndex, setModalIndex] = useState<number>();
  const [editString, setEditString] = useState<string>();
  const [musicTitle, setMusicTitle] = useState<string | undefined>();
  const [musicUrl, setMusicUrl] = useState<string>('');
  const [goal, setGoal] = useState<string>('');
  const [deadline, setDeadline] = useState<number>();
  const [postId, setPostId] = useState<number | undefined>();
  const { data: todos = [], refetch } = useTodos(postId);
  const { mutateAsync: deleteTodo } = useDeleteTodo(postId);
  const { mutateAsync: createTodo } = useCreateTodo(postId);

  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${'0' + (today.getMonth() + 1).toString().slice(-2)}-${today.getDate()}`;

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get('posts/');
        const data = res.data.find((item: any, i: number) => {
          if (item.todo_date === formattedDate) return i;
        });
        // console.log(data);
        setPostId(data.id);
        if (res) {
          setGoal(data.goal);
          setDeadline(data.days_by_deadline);
        }
      } catch (e) {
        // console.log(e);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const postTodo = async () => {
      try {
        const res = await axios.get('posts/');
        const data = res.data.find((item: any, i: number) => {
          if (item.todo_date === formattedDate) return i;
        });
        if (!data) {
          await axios.post('posts/', { todo_date: formattedDate });
        }
      } catch (error) {}
    };
    postTodo();
  }, []);

  // console.log(postId);

  const onInsert = useCallback(
    async (text?: string) => {
      if (text) {
        if (editString !== undefined && modalIndex !== undefined) {
          const edit = todos.find(v => v.id === modalIndex);
          if (edit !== undefined) {
            edit.todo_item = text;
            // setTodos([...todos]);
          }
          await axios.put(`posts/todo/${postId}/${modalIndex}`, {
            todo_item: text,
          });
          setEditString(undefined);
          setModalIndex(undefined);
        } else {
          const todo = {
            todo_item: text,
          };
          createTodo(todo as TodoType);
        }
      } else {
        alert('TODO를 적어주세요!');
      }
    },
    [todos, editString, modalIndex],
  );

  const openModal = useCallback(
    (index: number) => {
      setModalIndex(index);
      setEditString(undefined);
      if (index === modalIndex) {
        setIsModalOpen(prev => !prev);
      } else {
        setIsModalOpen(true);
      }
    },
    [modalIndex],
  );

  const onRemove = useCallback(
    async (id?: number) => {
      // if (id != undefined) {
      //   setTodos(todos.filter(todo => todo.id !== id));
      // }
      // await axios.delete(`https://api.oz-02-main-04.xyz/api/v1/posts/todo/1/${id}`);
      deleteTodo(id!);
      setIsModalOpen(false);
      setModalIndex(undefined);
    },
    [todos],
  );

  const onEdit = useCallback(
    (id?: number) => {
      if (id != undefined) {
        const edit = todos.find(v => v.id === id);
        setEditString(edit?.todo_item);
        setIsModalOpen(false);
      }
    },
    [todos],
  );

  const handleComplete = useCallback(
    async (id: number) => {
      const sortByUpdatedAt = (todos: TodoItem[]) =>
        todos.sort((a, b) => Number(new Date(b.updated_at)) - Number(new Date(a.updated_at)));
      const checked = todos.find(v => v.id === id);
      if (checked !== undefined) {
        checked.done = !checked.done;
        await axios.put(`posts/todo/${postId}/${id}`, { done: checked.done });
        sortByUpdatedAt(todos);
        refetch();
      }
    },
    [todos],
  );

  const deleteMusic = async () => {
    await axios.delete(`https://api.oz-02-main-04.xyz/api/v1/posts/music/${postId}`);
    setMusicTitle('');
  };

  useEffect(() => {
    const getMusic = async () => {
      try {
        if (postId !== undefined) {
          const res = await axios.get(`posts/music/playing/${postId}`);
          // console.log(res.data);
          if (res) {
            setMusicTitle(res.data.title);
            setMusicUrl(res.data.song_url);
          }
        }
      } catch (e) {
        return;
      }
    };
    getMusic();
  }, []);

  return (
    <div className="w-full h-full">
      <main className="wrap-section relative ">
        <header className="pt-[2rem]">
          <div className="flex w-full h-[3.1875rem] px-5 justify-between items-center border-b-[0.0313rem] border-borderGray">
            <p className="font-bold text-black-900 text-[1.125rem]">{goal}</p>
            <div className="w-[3.75rem] h-[2.375rem] text-primary-600 font-extrabold text-[1.625rem] text-center flex justify-center items-center">
              D-{deadline}
            </div>
          </div>
          <section className="w-full h-[2.5625rem] flex border-b-[0.0313rem] border-borderGray items-center">
            <div className="flex w-[8.8125rem] h-[2rem] border-r-[0.0313rem] border-borderGray relative items-center justify-center text-[0.8125rem] font-medium text-black-900">
              {formattedDate}
            </div>
            <div className="w-[15.5rem] h-[2rem] px-[0.625rem] flex justify-between items-center">
              <Mood formattedDate={formattedDate} />
            </div>
          </section>
          <section>
            <div className="flex items-center justify-around w-full h-[2.5625rem] border-b-[0.0313rem] border-borderGray px-[0.625rem] gap-[0.3125rem]">
              <Timer postId={postId} />
            </div>
          </section>
          <section className="flex w-full h-[2.5625rem] items-center px-[0.625rem] gap-[0.625rem] border-b-[0.0313rem] border-borderGray">
            <div>
              <IoMusicalNotesOutline className="w-[1.25rem] h-[1.25rem]" />
            </div>
            <div className="w-full text-[0.75rem] font-medium text-black-900">
              {musicTitle ? (
                <div className="w-full flex items-center justify-between">
                  <span onClick={deleteMusic}>{musicTitle}</span>
                  <audio controls loop src={musicUrl} className="w-[11rem] h-[2.5rem]"></audio>
                </div>
              ) : (
                <MusicInput setMusicTitle={setMusicTitle} setMusicUrl={setMusicUrl} postId={postId} />
              )}
            </div>
          </section>
        </header>
        <section className="flex flex-col w-full h-[22rem] overflow-auto">
          <div className="border-r-[0.0313rem] border-borderGray w-[2.75rem] h-[22rem] absolute" />
          {todos.map((todo, key) => (
            <ToDoListItem
              id={todo.id}
              key={key}
              todo={todo}
              openModal={openModal}
              handleComplete={handleComplete}
              isModalOpen={isModalOpen}
              modalIndex={modalIndex}
            />
          ))}
        </section>
        <ToDoInsert onInsert={onInsert} init={editString} />
        {isModalOpen ? (
          <Modal onRemove={onRemove} onEdit={onEdit} id={modalIndex} setIsModalOpen={setIsModalOpen} />
        ) : (
          <></>
        )}
        <section>
          <p className="m-2 pb-1 border-b-borderGray border-b w-[3.0625rem] text-center">Memo</p>
          <textarea
            name="memo"
            id="memo"
            className="w-full h-[6rem] text-[0.875rem] px-2 resize-none focus:outline-none"></textarea>
        </section>
      </main>
      <NavBottom />
    </div>
  );
}

export default Page;

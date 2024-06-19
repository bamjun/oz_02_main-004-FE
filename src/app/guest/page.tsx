'use client';
import { accessTokenAtom } from '@/atoms/atoms';
import DeleteAlert from '@/components/guest/DeleteAlert';
import GuestListItem from '@/components/guest/GuestListItem';
import useMoveScrollBottom from '@/hooks/useMoveScrollBottom';
import { useGetGuestBook } from '@/services/getGuestBook';
import { usePostGuestBook } from '@/services/postGuestBook';
import { useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { FaUserFriends } from 'react-icons/fa';

export default function Guest() {
  const [userInput, setUserInput] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const { data: guestBook, isLoading: isGuestBookLoading, error: isGuestBookError } = useGetGuestBook(1);
  const guestBookList = guestBook ?? [];
  const { mutateAsync: postGuestBook } = usePostGuestBook();
  const scrollRef = useMoveScrollBottom(guestBookList);
  const router = useRouter();
  const accessToken = useAtomValue(accessTokenAtom);
  const itemId = useRef(0);

  useEffect(() => {
    console.log('accessToken', accessToken);
  }, [accessToken]);

  const modalHandler = () => {
    setModalOpen(!modalOpen);
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      setUserInput('');
      e.preventDefault();
      postGuestBook({ user_id: 1, content: userInput, guestbook_user: 1 });
    },
    [userInput, postGuestBook],
  );

  return (
    <main className="w-full h-full relative">
      <div className="w-full h-full bg-saturdayBlue absolute">배경</div>
      {modalOpen && <DeleteAlert onClose={modalHandler} itemId={itemId} />}
      <div className="w-full h-[calc(100%-2.6875rem)] absolute z-10 pt-11 px-[1.4375rem] flex flex-col">
        <button
          className="h-[3.3125rem] bg-white bg-opacity-70 rounded-[0.625rem] font-semibold flex items-center ml-auto px-[0.625rem]"
          onClick={() => router.push('/guest/friends')}>
          친구 방명록 놀러가기
          <span className="ml-2">
            <FaUserFriends size={32} />
          </span>
        </button>
        <div
          className={`w-[21.5rem] h-[34.6875rem] mt-[1.375rem] rounded-[5px] bg-white border border-black-200 relative flex flex-col`}>
          <div ref={scrollRef} className="w-full h-full overflow-auto scroll-bar">
            <ul className="py-2">
              {guestBookList.map((item, index) => {
                return (
                  <li key={index} className="border-b-[0.5px] border-black-200">
                    <GuestListItem item={item} modalHandler={modalHandler} itemId={itemId} />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
      <div className="w-full h-[2.6875rem] bg-white absolute bottom-0">
        <form className="w-full h-full flex" onSubmit={onSubmit}>
          <input
            type="text"
            className="border-black-200 border w-full h-full pl-2 focus:outline-none"
            placeholder="방명록 작성"
            onChange={handleChangeInput}
            value={userInput}
          />
          <button
            disabled={userInput.length === 0}
            className={`w-[2.8125rem] h-full flex items-center justify-center ${userInput.length !== 0 ? 'bg-primary-400' : 'bg-black-200'} active:bg-primary-200`}>
            <AiOutlinePlus className="text-[2rem] text-white" />
          </button>
        </form>
      </div>
    </main>
  );
}

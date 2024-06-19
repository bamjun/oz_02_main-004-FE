'use client';
import { selectedUserAtom } from '@/atoms/atoms';
import NickNameList from '@/components/guest/NickNameList';
import { useGetSearchNickName } from '@/services/getSearchNickName';
import { NickNameListType } from '@/types/guestBookType';
import { useAtom } from 'jotai';
import { useCallback, useState } from 'react';
import { MdSearch } from 'react-icons/md';

export default function Friends() {
  const [userInput, setUserInput] = useState('');
  const {
    data: Nickname,
    isLoading: isNicknameLoading,
    error: isNicknameError,
    refetch,
  } = useGetSearchNickName(userInput);
  const [nicknameList, setNicknameList] = useState<NickNameListType[]>([]);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isNicknameLoading && !isNicknameError) {
        const { data } = await refetch();
        setNicknameList(data);
        console.log(data);
      }
    },
    [isNicknameLoading, isNicknameError, refetch],
  );

  return (
    <main className="w-full h-full pt-[4.375rem]">
      <div className="w-full h-[3.75rem] flex justify-center items-center text-xl font-semibold">친구 찾기</div>
      <div className="w-full h-[2.6875rem] flex items-center mt-[1.125rem]">
        <form className="w-full h-full flex" onSubmit={onSubmit}>
          <div className="w-[calc(100%-2.8125rem)] h-full border-y border-black-200 flex items-center">
            <input
              type="text"
              placeholder="닉네임 입력"
              onChange={handleChangeInput}
              maxLength={255}
              className="w-full mx-[0.625rem] outline-none"
            />
          </div>
          <button
            disabled={userInput.length === 0}
            className={`w-[2.8125rem] h-full ${userInput.length !== 0 ? 'bg-primary-400' : 'bg-black-200'} flex justify-center items-center`}>
            <MdSearch size={32} color="white" />
          </button>
        </form>
      </div>
      <section>
        <NickNameList nicknameList={nicknameList} />
      </section>
    </main>
  );
}

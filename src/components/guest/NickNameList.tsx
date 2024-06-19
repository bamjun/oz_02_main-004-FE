import { selectedUserAtom } from '@/atoms/atoms';
import { NickNameListType } from '@/types/guestBookType';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';

export default function NickNameList({ nicknameList }: { nicknameList: NickNameListType[] }) {
  const [selectUser, setSelectUser] = useAtom(selectedUserAtom);
  const router = useRouter();

  if (nicknameList === undefined) return;

  return (
    <ul className="w-full h-[31.25rem] border-b border-black-200 overflow-auto scroll-bar">
      {nicknameList.map((nickname: NickNameListType, index: number) => {
        return (
          <li
            onClick={() => {
              setSelectUser(nickname);
              router.push(`/guest/friends/${nickname.id}`);
            }}
            key={index}
            className="h-[3.6875rem] border-b-[0.5px] border-black-200 text-lg flex items-center pl-[0.8125rem] cursor-pointer active:bg-primary-200 active:text-white">
            {nickname.nickname}
          </li>
        );
      })}
    </ul>
  );
}

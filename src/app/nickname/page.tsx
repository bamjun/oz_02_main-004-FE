'use client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { userAtom } from '@/atoms/atoms';
import { useAtom } from 'jotai';
import NavBottom from '@/components/NavBottom';
import { useRouter } from 'next/navigation';

interface User {
  id?: number;
  계정?: string;
  닉네임: string;
}

const getCookieValue = (name: any) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(';').shift();
};

const Nickname = () => {
  const [user, setUser] = useState<User | null>(null);
  const [newNickname, setNewNickname] = useState('');
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useAtom(userAtom);
  const router = useRouter();
  useEffect(() => {
    const csrfToken = getCookieValue('csrftoken');
    const token = getCookieValue('access_token');
    console.log(csrfToken);
    console.log(accessToken);
    if (token) {
      setAccessToken(token);
    }
    if (csrfToken) {
      setCsrfToken(csrfToken);
    }
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      console.log(csrfToken);
      console.log(accessToken);

      if (!accessToken || !csrfToken) return;
      try {
        const response = await axios.get('https://api.oz-02-main-04.xyz/api/v1/users/myinfo/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-CSRFToken': csrfToken,
          },

          withXSRFToken: true,
        });
        setUser(response.data);
        setUserInfo(response.data);
        console.log(user);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserInfo();
  }, [accessToken, csrfToken]);

  const handleNicknameChange = async () => {
    console.log(user);
    if (!newNickname) {
      alert('닉네임을 입력해주세요.');
      return;
    }
    try {
      const response = await axios.post(
        'https://api.oz-02-main-04.xyz/api/v1/users/myinfo/',
        {
          action: 'change_nickname',
          nickname: newNickname,
        },
        {
          headers: {
            'Content-Type': 'application/json',

            Authorization: `Bearer ${accessToken}`,
            'x-csrftoken': csrfToken,
          },
          withXSRFToken: true,
        },
      );
      if (response.status === 200) {
        alert('닉네임이 변경되었습니다.');
        setUser({ ...user, 닉네임: newNickname });
      }
      router.push('/profile');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  p-4">
      {user ? (
        <div className="wrap-section w-full max-w-xs">
          <h1 className="text-2xl font-bold text-purple-600 mb-4">닉네임 변경하기</h1>
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700">계정: {user?.계정}</p>
            <p className="text-sm font-medium text-gray-700">닉네임: {user?.닉네임}</p>
          </div>
          <input
            type="text"
            value={newNickname}
            onChange={e => setNewNickname(e.target.value)}
            placeholder="새 닉네임 입력"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          />
          <button
            onClick={handleNicknameChange}
            className="mt-4 w-full px-4 py-2 bg-purple-600 text-white rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
            완료
          </button>
          <NavBottom />
        </div>
      ) : (
        <p className="text-lg text-purple-600">로딩 중...</p>
      )}
    </div>
  );
};

export default Nickname;

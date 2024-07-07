'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAtom } from 'jotai';
import { userAtom, accessTokenAtom, csrfTokenAtom, nicknameAtom } from '@/atoms/atoms';
import Image from 'next/image';
import NavBottom from '@/components/NavBottom';
import Link from 'next/link';
import { getCookieValue } from '@/libs/getCookieValue';

interface User {
  id: number;
  계정: string;
  닉네임: string;
}

function deleteCookie(name: any, path: any, domain: any) {
  if (getCookieValue(name)) {
    document.cookie =
      name + '=; Max-Age=-99999999;' + (path ? '; path=' + path : '') + (domain ? '; domain=' + domain : '');
  }
}

export default function Page() {
  const [user, setUser] = useAtom<User | null>(userAtom);
  const [accessToken, setAccessToken] = useAtom<string | null>(accessTokenAtom);
  const [csrf, setCsrf] = useAtom<string | null>(csrfTokenAtom);
  const [isLoading, setIsLoading] = useState(true);
  const [nickname, setNickname] = useAtom(nicknameAtom);
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const csrfToken = getCookieValue('csrftoken');
        const token = getCookieValue('access_token');
        if (token) {
          setAccessToken(token);
        }
        if (csrfToken) {
          setCsrf(csrfToken);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchTokens();
  }, [setAccessToken]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!accessToken || !csrf) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await axios.get('https://api.petodo.today/api/v1/users/myinfo/', {
          withXSRFToken: true,
          withCredentials: true,
          headers: {
            'x-csrftoken': csrf!,
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUser(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [accessToken, csrf, setUser]);

  const handleLogout = async () => {
    try {
      deleteCookie('access_token', '/', 'petodo.today');
      deleteCookie('refresh_token', '/', 'petodo.today');
      deleteCookie('csrftoken', '/', 'petodo.today');
      deleteCookie('csrftoken', '/', 'api.petodo.today');
      deleteCookie('user_state', '/', 'petodo.today');
      setUser(null);
      setAccessToken(null);
      setCsrf(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleKakaoLogin = () => {
    const kakaoAuthUrl = `https://api.petodo.today/api/v1/users/kakao/`;
    window.location.href = kakaoAuthUrl;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="h-full wrap-section">
      {' '}
      {nickname}
      {user ? (
        <>
          <div className="wrap-section flex flex-col items-center justify-center min-h-screen p-4">
            <p className="text-2xl font-bold text-purple-600 mb-4">안녕하세요! {user.닉네임} 님</p>
            <hr className="border-purple-600 w-full mb-4" />
            <ul className="space-y-4">
              <li>
                <Link href="/nickname">
                  <a className="text-purple-600 hover:underline">닉네임 변경하기</a>
                </Link>
              </li>
              <li>
                <Link href="/goal">
                  <a className="text-purple-600 hover:underline">목표 설정하기</a>
                </Link>
              </li>
              <li>
                {' '}
                <Link href="/introduce">
                  <a className="text-purple-600 hover:underline">petodo 가이드 보기</a>
                </Link>{' '}
              </li>
              <li>
                <a onClick={handleLogout} className="text-purple-600 hover:underline">
                  로그아웃
                </a>
              </li>
            </ul>
            <hr className="border-purple-600 w-full my-4" />
            <NavBottom />{' '}
          </div>
        </>
      ) : (
        <>
          <div className=" flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <p className="text-2xl font-bold text-purple-600 mb-4">로그인 해주세요.</p>
            <button
              onClick={handleKakaoLogin}
              className="mt-6 px-4 py-2 bg-purple-600 text-white rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
              카카오 로그인
            </button>

            <NavBottom />
          </div>
        </>
      )}
    </div>
  );
}

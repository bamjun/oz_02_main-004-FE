'use client';

import axios from 'axios';
import React, { useState } from 'react';
import { userAtom, accessTokenAtom, refreshTokenAtom } from '@/atoms/atoms';
import { useAtom } from 'jotai';
import { getCookieValue } from '@/libs/getCookieValue';
import NavBottom from '@/components/NavBottom';
import { useRouter } from 'next/navigation';

function Goal() {
  const [goal, setGoal] = useState<string | null>(null);
  const [dDay, setDDay] = useState<string | null>(null);
  const [user] = useAtom(userAtom);
  const [accessToken, setAccessToken] = useAtom(accessTokenAtom);
  const [refreshToken] = useAtom(refreshTokenAtom);
  const router = useRouter();

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post('https://api.oz-02-main-04.xyz/api/token/refresh/', {
        refresh: refreshToken,
      });
      const newAccessToken = response.data.access;
      setAccessToken(newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error('refresh access token:', error);
      return null;
    }
  };

  const handleSetGoal = async () => {
    if (!goal || !dDay) {
      alert('목표와 D-Day를 모두 입력해주세요.');
      return;
    }
    if (!user) {
      alert('로그인 해주세요!');
      router.push('/login');
    }
    const today = new Date().toISOString().split('T')[0];
    if (dDay <= today) {
      alert('디데이는 오늘 이후의 날짜여야 합니다.');
      return;
    }

    console.log('Goal:', goal);
    console.log('D-Day:', dDay);

    const csrfToken = getCookieValue('csrftoken');
    console.log('CSRF Token:', csrfToken);
    console.log(user);
    if (!user) return;

    try {
      const response = await axios.post(
        `https://api.oz-02-main-04.xyz/api/v1/posts/goal`,
        { goal, d_day: dDay, days_by_deadline: '' },
        {
          withCredentials: true,
          headers: {
            'X-CSRFToken': csrfToken,
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      alert(`1차 완료되었습니다! ${response.data}`);
      console.log(response.data);
      router.push('/profile');
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          try {
            const retryResponse = await axios.post(
              `https://api.oz-02-main-04.xyz/api/v1/posts/goal`,
              { goal, d_day: dDay, days_by_deadline: '' },
              {
                withCredentials: true,
                headers: {
                  'X-CSRFToken': csrfToken,
                  Authorization: `Bearer ${newAccessToken}`,
                },
              },
            );
            alert(`2차시도 완료되었습니다! ${retryResponse.data}`);
            console.log(retryResponse.data);
          } catch (retryError) {
            console.error('Retry request', retryError);
          }
        } else {
          console.error('refresh access token');
        }
      } else {
        console.error('Error:', error);
      }
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="wrap-section flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold text-purple-600 mb-4">목표/디데이 설정</h1>
      <div className="w-full max-w-xs">
        <label htmlFor="goal" className="block text-sm font-medium text-gray-700">
          목표
        </label>
        <input
          id="goal"
          type="text"
          value={goal || ''}
          onChange={e => setGoal(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          placeholder="목표 입력"
        />
      </div>
      <div className="w-full max-w-xs mt-4">
        <label htmlFor="dDay" className="block text-sm font-medium text-gray-700">
          D-Day
        </label>
        <input
          id="dDay"
          type="date"
          value={dDay || ''}
          min={today}
          onChange={e => setDDay(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
        />
      </div>
      <button
        onClick={handleSetGoal}
        className="mt-6 px-4 py-2 bg-purple-600 text-white rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
        완료
      </button>
      <NavBottom />
    </div>
  );
}

export default Goal;

'use client';

import axios from 'axios';
import React, { useState } from 'react';
import { userAtom, csrfTokenAtom, accessTokenAtom } from '@/atoms/atoms';
import { useAtom } from 'jotai';
import { getCookieValue } from '@/libs/getCookieValue';
function Goal() {
  const [goal, setGoal] = useState<string>('');
  const [dDay, setDDay] = useState<string>('');
  const [user] = useAtom(userAtom);
  const [accessToken] = useAtom(accessTokenAtom);

  const handleSetGoal = async () => {
    console.log(goal);
    console.log(dDay);

    const csrfToken = getCookieValue('csrftoken');
    console.log(csrfToken);
    if (!user) return;
    try {
      const response = await axios.post(
        `https://api.oz-02-main-04.xyz/api/v1/posts/goal`,
        { goal: goal, d_day: dDay, days_by_deadline: '' },
        {
          withXSRFToken: true,
          withCredentials: true,
          headers: {
            'x-csrftoken': csrfToken,
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      alert(`완료되었습니다! ${response.data}`);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-purple-600 mb-4">목표/디데이 설정</h1>
      <div className="w-full max-w-xs">
        <label htmlFor="goal" className="block text-sm font-medium text-gray-700">
          목표
        </label>
        <input
          id="goal"
          type="text"
          value={goal}
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
          value={dDay}
          onChange={e => setDDay(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
        />
      </div>
      <button
        onClick={handleSetGoal}
        className="mt-6 px-4 py-2 bg-purple-600 text-white rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
        완료
      </button>
    </div>
  );
}

export default Goal;

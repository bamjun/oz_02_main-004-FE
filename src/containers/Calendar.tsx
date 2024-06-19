'use client';
import ProgressBar from '@/components/monthly/ProgressBar';
import SelectBox from '@/components/SelectBox';
import { DAY_OF_WEEK } from '@/constants';
import useSwipeDirection from '@/hooks/useSwipeDirection';
import { useEffect, useRef, useState } from 'react';
import useSetOptions from '@/hooks/useSetOptions';
import { useRouter } from 'next/navigation';
import { useGetPostsList } from '@/services/getPostsList';
import createCalendar from '@/libs/createCalendar';

export default function Calendar() {
  const today = new Date().getDate();
  const todayMonth = new Date().getMonth() + 1;
  const todayYear = new Date().getFullYear();
  const [currentYear, setCurrentYear] = useState(todayYear);
  const [currentMonth, setCurrentMonth] = useState(todayMonth);
  const { data: posts, isLoading: isPostsLoading, error: isPostsError } = useGetPostsList();
  const postsList = posts ?? [];
  const [calendar, setCalendar] = useState<string[][]>([]);
  const [startDate, setStartDate] = useState('');
  const [lastDate, setLastDate] = useState('');
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const { direction, setDirection } = useSwipeDirection(calendarRef);
  const { yearOptions, monthOptions } = useSetOptions({
    startDate,
    lastDate,
    currentYear,
    currentMonth,
    setCurrentMonth,
  });
  const router = useRouter();

  useEffect(() => {
    if (posts !== undefined) {
      const dateList = posts.map(res => Number(res.todo_date.replace(/[^0-9]/g, '')));
      setStartDate(Math.min(...dateList).toString());
      setLastDate(Math.max(...dateList).toString());
    } else {
      setStartDate(todayYear.toString() + todayMonth.toString().padStart(2, '0'));
      setLastDate(todayYear.toString() + todayMonth.toString().padStart(2, '0'));
    }
  }, [posts, todayMonth, todayYear]);

  useEffect(() => {
    if (direction === 'left') {
      if (
        currentYear === yearOptions[yearOptions.length - 1] &&
        currentMonth + 1 > monthOptions[monthOptions.length - 1]
      )
        return;
      else setCurrentMonth(prev => prev + 1);
    } else if (direction === 'right') {
      if (currentYear === yearOptions[0] && currentMonth - 1 < monthOptions[0]) return;
      else setCurrentMonth(prev => prev - 1);
    }
    setDirection('');
  }, [direction, currentMonth, currentYear, monthOptions, yearOptions, setDirection]);

  useEffect(() => {
    if (currentMonth < 1) {
      setCurrentYear(prev => prev - 1);
      setCurrentMonth(12);
    } else if (currentMonth > 12) {
      setCurrentYear(prev => prev + 1);
      setCurrentMonth(1);
    }
    setCalendar(() => createCalendar(currentYear, currentMonth));
  }, [currentYear, currentMonth]);

  if (isPostsLoading) {
    return <div>Loading...</div>;
  }

  if (isPostsError) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="w-full">
      <div className="w-full p-[1.125rem]">
        <div className="h-10 mt-8 flex justify-center items-center space-x-[0.625rem]">
          <SelectBox
            type={'년'}
            possibleList={yearOptions}
            currentProps={currentYear}
            setCurrentProps={setCurrentYear}
          />
          <SelectBox
            type={'월'}
            possibleList={monthOptions}
            currentProps={currentMonth}
            setCurrentProps={setCurrentMonth}
          />
        </div>
        <div ref={calendarRef} className="w-full h-fit min-h-80 mt-7">
          <table className="w-full h-full text-center">
            <thead className="border-y border-black-200">
              <tr className="h-[1.4375rem]">
                {DAY_OF_WEEK.map((day, i) => {
                  return (
                    <td
                      key={i}
                      className={`${i === 0 && 'text-errorRed'} ${i === 6 && 'text-saturdayBlue'} text-xs align-middle ${i !== 0 && i !== 6 && 'border-[0.5px]'} border-[#CACACA]`}>
                      {day}
                    </td>
                  );
                })}
              </tr>
            </thead>
            <tbody className={`${direction === '' && 'animate-fadeIn'}`}>
              {calendar.map((week_arr, j) => {
                return (
                  <tr key={j} className="w-full h-[3.0625rem] border-y border-black-200">
                    {week_arr.map((day, i) => {
                      const isToday = today === Number(day) && todayMonth === currentMonth && todayYear === currentYear;
                      const postOnThisDate = postsList.find(
                        post =>
                          Number(post.todo_date.slice(0, 4)) === currentYear &&
                          Number(post.todo_date.slice(5, 7)) === currentMonth &&
                          Number(post.todo_date.slice(8, 10)) === Number(day),
                      );
                      const hasPosts = !!postOnThisDate;
                      const postId = postOnThisDate ? postOnThisDate.id : null;
                      return (
                        <td
                          key={i}
                          className={`w-[3.1875rem] h-full text-xs ${i !== 0 && i !== 6 && 'border-[0.0313rem]'} align-middle text-center border-black-200 `}>
                          <button
                            disabled={!hasPosts}
                            onClick={() => {
                              if (!isToday) {
                                router.push(`monthly/${postId}`);
                              } else {
                                router.push(`/todolist`);
                              }
                            }}>
                            <div
                              className={`w-[1.125rem] h-[1.125rem] rounded-full flex justify-center items-center ${isToday ? 'bg-primary-500 text-white' : ''} ${!hasPosts ? 'text-black-300' : ''} mx-auto`}>
                              {day}
                            </div>
                            {hasPosts &&
                              postsList.map((post, i) => {
                                if (
                                  Number(post.todo_date.slice(0, 4)) === currentYear &&
                                  Number(post.todo_date.slice(5, 7)) === currentMonth &&
                                  Number(post.todo_date.slice(8, 10)) === Number(day)
                                ) {
                                  return (
                                    <div key={i} className="w-full mx-auto mt-1">
                                      <div className="h-3 flex justify-center items-center text-2xs">
                                        {post.todo_progress}%
                                      </div>
                                      <ProgressBar rate={post.todo_progress} />
                                    </div>
                                  );
                                }
                              })}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

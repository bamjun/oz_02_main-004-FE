'use client';
import NavBottom from '@/components/NavBottom';
import Calendar from '@/containers/Calendar';
import { useGetStreak } from '@/services/getStreak';

export default function Monthly() {
  const { data: streak, isLoading: isStreakLoading, error: isStreakError } = useGetStreak();
  const streakNumber = streak?.streak ?? 0;

  return (
    <main className="w-full h-full">
      <section className="wrap-section flex flex-col justify-center items-center">
        <div className="text-2xl font-bold">Monthly</div>
        <Calendar />
        <div className="h-[4.0625rem] text-center">
          <div className="font-medium">
            <span className="text-primary-600">{streakNumber}일</span> 연속 목표 달성!
          </div>
          <div className="text-xs text-black-200 font-medium">5일 달성 시 랜덤박스 증정</div>
        </div>
      </section>
      <NavBottom />
    </main>
  );
}

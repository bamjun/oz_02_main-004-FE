'use client';
import NavBottom from '@/components/NavBottom';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

function RandomBox() {
  const router = useRouter();
  const [isBoxClicked, setIsBoxClicked] = useState(false);
  const [randomImage, setRandomImage] = useState('/randombox/box.png');
  const [boxCount, setBoxCount] = useState(1);

  const handleboxClick = () => {
    if (boxCount !== 0) {
      setIsBoxClicked(true);
      setBoxCount(boxCount - 1);
    } else {
      alert('보유한 랜덤박스가 없습니다.');
    }
  };
  const handleRetryClick = () => {
    if (boxCount !== 0) {
      setIsBoxClicked(false);
    } else {
      alert('보유한 랜덤박스가 없습니다.');
    }
  };

  return (
    <div className="w-full h-full">
      <div className="relative wrap-section bg-cover bg-[url(/randombox/star.jpg)]">
        <div className="h-full flex">
          <div className="m-auto">
            {isBoxClicked ? (
              <div>
                <Image src={randomImage} alt="randomImage" width={300} height={300} className="pb-8 animate-boxopen" />
                <div
                  className="text-center text-white text-4xl font-bold p-1
                  bg-primary-500">
                  카피바라
                </div>
                <div className="flex justify-center">
                  <button className="p-4" onClick={handleRetryClick}>
                    다시뽑기
                  </button>
                  <button className="p-4" onClick={() => router.push('/')}>
                    돌아가기
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <button onClick={handleboxClick}>
                  <Image
                    src="/randombox/box.png"
                    alt="box"
                    width={300}
                    height={300}
                    className="pb-8 animate-vibration"
                  />
                </button>
                <div
                  className="text-center text-white text-4xl font-bold p-1
                  drop-shadow-[0_4px_4px_rgba(129,51,234,100)]">
                  박스를 클릭하세요!
                </div>
                <button className="w-full p-4 my-0 mx-auto" onClick={() => router.push('/')}>
                  돌아가기
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <NavBottom />
    </div>
  );
}

export default RandomBox;

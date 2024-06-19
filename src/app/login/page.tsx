'use client';
import Image from 'next/image';
import { userAtom, accessTokenAtom, refreshTokenAtom, nicknameAtom } from '@/atoms/atoms';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const KakaoLogin = () => {
  const router = useRouter();
  const [user, setUser] = useAtom(userAtom);
  const [accessToken, setAccessToken] = useAtom(accessTokenAtom);
  const [refreshToken, setRefreshToken] = useAtom(refreshTokenAtom);
  const [nickname, setNickname] = useAtom(nicknameAtom);
  useEffect(() => {
    console.log(user);
    if (!user === null) {
      router.push('/');
    }
  }, [user, router]);

  const handleKakaoLogin = () => {
    setNickname('nickname changed');
    const kakaoAuthUrl = `https://api.oz-02-main-04.xyz/api/v1/users/kakao/`;
    window.location.href = kakaoAuthUrl;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  p-4">
      <button onClick={handleKakaoLogin}>
        {' '}
        {nickname}
        <Image src={'/images/kakaoLogin.png'} alt="kakao-login" width={200} height={200} />
      </button>
    </div>
  );
};

export default KakaoLogin;

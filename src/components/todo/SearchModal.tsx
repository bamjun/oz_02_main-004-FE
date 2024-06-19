import axios from 'axios';
import { SetStateAction } from 'jotai';
import React, { useState } from 'react';

interface Props {
  setIsModalOpen(boolean: boolean): void;
  setMusicTitle(v: string): void;
  setMusicUrl: React.Dispatch<React.SetStateAction<string>>;
  postId: number | undefined;
}

function SearchModal({ setIsModalOpen, setMusicTitle, setMusicUrl, postId }: Props) {
  const [value, setValue] = useState('');
  const [musicList, setMusicList] = useState<any[]>([]);

  const getValue = (e: { preventDefault: () => void; target: { value: React.SetStateAction<string> } }) => {
    e.preventDefault();
    setValue(e.target.value);
  };

  const onSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const music = await axios.get(`https://api.oz-02-main-04.xyz/api/v1/posts/music/${postId}?query=${value}`);
      setMusicList(music.data);
      console.log(musicList);
    } catch {
      console.log('에러');
    }
  };

  const onMusic = async (v: SetStateAction<any>, s: SetStateAction<any>, u: SetStateAction<any>) => {
    setMusicTitle(`${s} - ${v}`);
    setMusicUrl(u);
    await axios.post('https://api.oz-02-main-04.xyz/api/v1/posts/music/3', { title: v, singer: s, song_url: u });
  };

  return (
    <>
      <div className="absolute top-0 left-0 w-full h-full bg-black-950 bg-opacity-50 z-10"></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
        <div className="bg-white">
          <form onSubmit={onSubmit}>
            <input
              type="text"
              value={value}
              onChange={getValue}
              className=""
              placeholder="음악을 입력해주세요."></input>
          </form>
          <div className="w-full h-[20rem] bg-white overflow-scroll">
            <ul>
              {musicList ? (
                musicList.map((item, index) => (
                  <li onClick={() => onMusic(item.title, item.singer, item.song_url)} key={index}>
                    {item.singer} - {item.title}
                  </li>
                ))
              ) : (
                <></>
              )}
            </ul>
          </div>
          <div onClick={() => setIsModalOpen(false)}>닫기</div>
        </div>
      </div>
    </>
  );
}

export default SearchModal;

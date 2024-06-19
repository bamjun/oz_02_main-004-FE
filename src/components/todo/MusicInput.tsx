import React, { Dispatch, useState } from 'react';
import SearchModal from './SearchModal';
import { SetStateAction } from 'jotai';

interface Props {
  setMusicTitle: React.Dispatch<React.SetStateAction<string | undefined>>;
  setMusicUrl: React.Dispatch<React.SetStateAction<string>>;
  postId?: number | undefined;
}

function MusicInput({ setMusicTitle, setMusicUrl, postId }: Props) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <button onClick={() => setIsModalOpen(!isModalOpen)}>음악 검색을 하시려면 여기를 클릭해주세요!</button>
      {isModalOpen ? (
        <SearchModal
          setIsModalOpen={setIsModalOpen}
          setMusicTitle={setMusicTitle}
          setMusicUrl={setMusicUrl}
          postId={postId}
        />
      ) : (
        <></>
      )}
    </>
  );
}

export default MusicInput;

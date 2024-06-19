import { MutableRefObject } from 'react';

export interface GuestBookListType {
  id: number;
  user_nickname: string;
  created_at: string;
  updated_at: string;
  content: string;
  guestbook: number;
  user: number;
}

export interface GuestListItemProps {
  item: {
    id: number;
    user_nickname: string;
    created_at: string;
    updated_at: string;
    content: string;
    guestbook: number;
    user: number;
  };
  modalHandler: () => void;
  itemId: MutableRefObject<number>;
}

export interface postGuestBookProps {
  user_id: number;
  content: string;
  guestbook_user: number;
}

export interface NickNameListType {
  id: number;
  nickname: string;
}

export interface DeleteAlertProps {
  onClose: () => void;
  itemId: MutableRefObject<number>;
}

export interface SelectedUser {
  id: number;
  nickname: string;
}

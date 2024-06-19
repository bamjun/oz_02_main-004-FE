import { SelectedUser } from '@/types/guestBookType';
import { atom } from 'jotai';

export interface User {
  id: number;
  계정: string;
  닉네임: string;
}
const defaultUser: User = {
  id: 1,
  계정: 'defaultAccount',
  닉네임: 'defaultNickname',
};
export const nicknameAtom = atom('nick');
export const userAtom = atom<User | null>(defaultUser);
export const accessTokenAtom = atom<string | null>(null);

export const refreshTokenAtom = atom<string | null>(null);
export const csrfTokenAtom = atom<string | null>(null);
export const selectedUserAtom = atom<SelectedUser | null>(null);

import { UserDTO } from '../entities/userDTO';
export const UPDATE_USER = 'UPDATE_USER';

export const setUser = (user: UserDTO | null) => {
  return { type: UPDATE_USER, user };
};

export interface Action {
  type: string;
  user: UserDTO;
}

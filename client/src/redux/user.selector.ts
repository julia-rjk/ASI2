import { UserDTO } from '../entities/userDTO';
export const selectUser = (state: { user: UserDTO }) => state.user;

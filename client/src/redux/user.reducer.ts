import { Action, UPDATE_USER } from './user.action';

const initialState = {
  user: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user') || '')
    : null,
};

const userReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case UPDATE_USER:
      action.user === null
        ? localStorage.removeItem('user')
        : localStorage.setItem('user', JSON.stringify(action.user));
      return {
        ...state,
        user: action.user,
      };
    default:
      return state;
  }
};

export default userReducer;

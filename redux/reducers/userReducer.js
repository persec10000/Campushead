import ActionTypes from '../types';

const initialState = {
  loading: false,
  token: '',
  
  id: 0,
  email: '',
  username: '',
  nickname: '',
  profileURL: '',
  membership: null,
  role: 'none-member',
  position: null,
};

export default function userReducer (state = initialState, action) {
  console.log (action.type.toString ());
  switch (action.type) {
    case ActionTypes.LOGIN_START:
      return {
        ...state,
        loading: true,
      };
      break;
    case ActionTypes.LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
      };
      break;
    case ActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        ...action.payload,
        loading: false,
      };
      break;
    case ActionTypes.REGISTER_START:
      return {
        ...state,
        loading: true,
      };
      break;
    case ActionTypes.REGISTER_FAILURE:
      return {
        ...state,
        loading: false,
      };
      break;
    case ActionTypes.REGISTER_SUCCESS:
      return {
        ...state,
        ...action.payload,
        loading: false,
      };
      break;
    case ActionTypes.UPDATE_USER_PROFILE:
      return {
        ...state,
        ...action.payload,
        loading: false,
      };
    default:
      return state;
      break;
  }
}

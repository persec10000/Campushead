import ActionTypes from '../types';

const initialState = {
  teamId: 0,
  isExistTeam: false,
  teamName: '',
  role: 'none-member',
  joinState: 0,

  ownerId: 0,
  teamList: [],
  loading: false,
  refreshing: false,

};

export default function teamReducer (state = initialState, action) {
  console.log (action.type.toString ());
  switch (action.type) {
    case ActionTypes.TEAM_INITIALIZE_START:
      return {
        ...state,
        loading: true,
      };
      break;
    case ActionTypes.REFRESH_TEAM_LIST_START:
      return{
        ...state,
        loading: false,
        refreshing: true
      }  
    case ActionTypes.TEAM_INITIALIZE_FAILURE:
      return {
        ...state,
        loading: false,
        refreshing: false
      };
      break;
    case ActionTypes.TEAM_INITIALIZE_SUCCESS:
      console.log('action.payload when initializing..=', action.payload);
      return {
        ...state,
        ...action.payload,
        loading: false,
        refreshing: false,
      };
      break;
    case ActionTypes.JOIN_TEAM_START:
      return{
        ...state,
        loading: true
      }
      break;
    case ActionTypes.JOIN_TEAM_FAILURE:
      return {
        ...state,
        loading: false,
      }    
      break;
    case ActionTypes.JOIN_TEAM_SUCCESS:
      return{
        ...state,
        ...action.payload,
        loading: false
      }  
    case ActionTypes.UPDATE_TEAM_PROFILE:
      return {
        ...state,
        ...action.payload,
      };
      break;
    case ActionTypes.TEAM_LIST_REQUEST_START:
      return {
        ...state,
        loading:false,
      } 
      break; 
    case ActionTypes.EXIT_TEAM_START:
      return{
        ...state,
        loading:true
      }  
      break;
    case ActionTypes.EXIT_TEAM_FAILURE:
      return{
        ...state,
        loading: false
      }  
      break;
    case ActionTypes.EXIT_TEAM_SUCCESS:
      return{
        ...state,
        ...action.payload,
        loading: false,
      }  
      break;  
    default:
      return state;
      break;
  }
}

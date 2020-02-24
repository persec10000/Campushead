import ActionTypes from '../types';

const initialState = {
  sbtList: [],
  loading: false,
  refreshing: false,
};    

export default function sbtReducer (state = initialState, action) {
  console.log (action.type.toString ());
  switch (action.type) {
    case ActionTypes.SBT_LIST_INITIALIZE_START:
      return {
        ...state,
        loading: true,
      };
      break;
    case ActionTypes.REFRESH_SBT_LIST_START:
      return {
        ...state,
        loading: false,
        refreshing: true,
      };
      break;
    case ActionTypes.GET_SBT_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        refreshing: false,
      };
      break;
    case ActionTypes.GET_SBT_LIST_SUCCESS:
      return {
        ...state,
        ...action.payload,
        loading: false,
        refreshing: false,
      };
      break;
    case ActionTypes.ADD_SBT_SUCCESS:
      {
        console.log('------------------------');
        console.log(action.payload);
        var _sbtList = [...state.sbtList, action.payload];
        console.log (_sbtList);
        console.log('------------------------');
        return {
          ...state,
          sbtList: _sbtList,
          loading: false,
          refreshing: false,
        };
      }
      break;
    case ActionTypes.ADD_SBT_FAILURE:
        return {
          ...state,
          loading: false,
          refreshing: false,
        };
      break;
    case ActionTypes.REMOVE_SBT_SUCCESS:
      {
        console.log ();
        var sbtList = state.sbtList;
        var _sbtList = state.sbtList;
        if (sbtList != []) {
          _sbtList = sbtList.filter (item => item.id != action.payload.id);
        }
        console.log (_sbtList);
        return {
          ...state,
          sbtList: _sbtList,
          loading: false,
          refreshing: false,
        };
      }
      break;
    case ActionTypes.REMOVE_SBT_FAILURE:

        return {
          ...state,
          loading: false,
          refreshing: false,
        };

      break;
    default:
      return state;
      break;
  }
}

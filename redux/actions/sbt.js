import { getHeaders, hostUrl } from '../../components/apihost';
import ActionTypes from '../types';

/**
 * @param {number} teamId 
 * @param {boolean} isRefresh 
 */
export const getSbtList = (teamId, isRefresh) => {
  console.log(teamId, isRefresh);
  return async dispatch => {
    console.log('here 1');
    if (isRefresh) {
      dispatch (initializeStart ());
    } else {
      dispatch (refreshSbtListStart ());
    }

    console.log ('teamId = ' + teamId);
    console.log('here 2');
    var _headers = await getHeaders ();
    await fetch (hostUrl + '/sbt/' + teamId, {
      method: 'GET',
      headers: _headers,
    })
      .then (response => response.json())
      .then (resJson => {
        console.log (resJson);
        const {status, error, data} = resJson;
        console.log('state, error, data: ', status, error, data);

        if (status == 0) {
          console.log (error);
          dispatch (getSbtListFailure ());
        } else {
          dispatch (
            getSbtListSuccess ({
              sbtList: data,
            })
          );
        }
      })
      .catch (error => {
        console.log (error);
        dispatch (getSbtListFailure ());
      });
  };
};


// function type actions
function initializeStart () {
  return {
    type: ActionTypes.SBT_LIST_INITIALIZE_START,
  };
}

const refreshSbtListStart = () => ({
  type: ActionTypes.REFRESH_SBT_LIST_START,
});

const getSbtListFailure = () => ({
  type: ActionTypes.GET_SBT_LIST_FAILURE,
});

const getSbtListSuccess = (payload) =>({
  type: ActionTypes.GET_SBT_LIST_SUCCESS,
  payload: payload
})

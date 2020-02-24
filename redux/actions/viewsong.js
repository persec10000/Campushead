import ActionTypes from '../types';
import FireBaseApp from '../../components/config';
import AStorageManager from '../../components/asyncStorageManager';
import Utils from '../../components/utils';
import {hostUrl, getHeaders} from '../../components/apihost';

var jwtDecode = require ('jwt-decode');

export const addToSbt = (payload, teamId)=>{
  console.log('when add the sbt, payload: teamId', payload, teamId);
  return async dispatch=>{
    var _headers = await getHeaders();
    fetch (hostUrl + '/sbt/create', {
      method: 'POST',
      body: JSON.stringify ({
        song_id: payload.id,
        team_id: teamId
      }),
      headers: _headers,
    })
    .then (response => response.json())
    .then(resJson=>{
      const {status, error} = resJson;
      if(status == 0){
        console.log("when status ==0, error: ", error);
        dispatch(addSbtFailure());
      } else {
        dispatch(addSbtSuccess(payload));
      }
    })
    .catch(error=>{
      console.log('error: ', error);
      dispatch(addSbtFailure());
    });
  };
}

export const removeFromSbt = (songId, teamId)=>{
  console.log('when remove the sbt, songId: teamId', songId, teamId);
  return async dispatch=>{
    var _headers = await getHeaders();
    fetch (hostUrl + '/sbt/delete', {
      method: 'DELETE',
      body: JSON.stringify ({
        song_id: songId,
        team_id: teamId
      }),
      headers: _headers,
    })
    .then (response => response.json())
    .then(resJson=>{
      const {status, error} = resJson;
      if(status == 0){
        console.log("when status ==0, error: ", error);
        dispatch(removeSbtFailure());
      } else{
        dispatch(removeSbtSuccess({id: songId}));
      }
    })
    .catch(error=>{
      console.log('error: ', error);
      dispatch(removeSbtFailure());
    });
  };
}


// function type actions
const addSbtFailure = ()=>({
  type: ActionTypes.ADD_SBT_FAILURE
});

const addSbtSuccess = (payload)=>({
  type: ActionTypes.ADD_SBT_SUCCESS,
  payload: payload
});

const removeSbtFailure = ()=>({
  type: ActionTypes.REMOVE_SBT_FAILURE
});

const removeSbtSuccess = (payload)=>({
  type: ActionTypes.REMOVE_SBT_SUCCESS,
  payload: payload
});


import ActionTypes from '../types';
import FireBaseApp from '../../components/config';
import AStorageManager from '../../components/asyncStorageManager';
import Utils from '../../components/utils';
import {hostUrl, getHeaders} from '../../components/apihost';
import {updateTeamProfile} from './user';

var jwtDecode = require ('jwt-decode');

export const updateTeam = (payload) => {
  return async dispatch => {
    dispatch (updateTeamProfile(payload)); 
  };
};

//basic functions

// function type actions
function initializeStart () {
  return {
    type: ActionTypes.TEAM_INITIALIZE_START,
  };
}

const initializeFailure = () => ({
  type: ActionTypes.TEAM_INITIALIZE_FAILURE,
});

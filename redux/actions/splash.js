import ActionTypes from '../types';
import FireBaseApp from '../../components/config';
import AStorageManager from '../../components/asyncStorageManager';
import Utils from '../../components/utils';

import {updateProfile, updateTeamProfile} from './user';
import {hostUrl, getHeaders} from '../../components/apihost';
var jwtDecode = require ('jwt-decode');
/**
 * 1- there is no token => go to SignIn
 * 2- else  there is no team_id => go to TeamList and set the user info to redux
 * 3- else => go to home and set the user info and team info to redux
 * @param {*} navigation 
 */
export const preprocess = navigation => {
  return async dispatch => {
    var token = await AStorageManager.getToken ();
    console.log ('in splash, token: ', token);
    if (Utils.isNotEmpty (token)) {
      // in case there exists token
      var userProfile = await AStorageManager.getProfile ();
      dispatch (updateProfile (userProfile));
      var teamId = await AStorageManager.getTeamId ();
      console.log ('in splash, team id: ', teamId);

      if (Utils.isNotEmptyOrZero (teamId)) {
        // in case there exists team id
        var userId = userProfile.id;
        await getTeamInfo (userId, teamId, dispatch);
        // dispatch(updateTeamProfile(team_id));
        navigation.navigate ('Home');
      } else {
        navigation.navigate ('TeamList');
      }
    } else {
      navigation.navigate ('SignIn');
    }
  };
};

//basic function
/**
 * 
 * @param {number} userId 
 * @param {number} teamId 
 * @param {*} dispatch 
 */
const getTeamInfo = async (userId, teamId, dispatch) => {
  try {
    let _headers = await getHeaders ();
    await fetch (hostUrl + '/user/get/' + userId, {
      method: 'GET',
      headers: _headers,
    }).then (res => {
      res.json ().then (async data => {
        console.log ('when login, homeData = ', data);
        let userData = data[0];
          let teamPayload = {
            teamId: teamId,
            teamName: '',
            isExistTeam: true,
            role: userData.role,
            joinState: userData.join_state,
            ownerId: 0,
          };

          fetch (hostUrl + '/team/getById/' + teamId, {
            method: 'GET',
            headers: _headers,
          })
            .then (response => {
              response.json ().then (data => {
                var teamInfo = data.teamInfo[0];
                teamPayload.teamName = teamInfo.name;
                teamPayload.ownerId = teamInfo.created_by
                console.log ('teamPayload when sign info=', teamPayload);
              });
              dispatch (updateTeamProfile (teamPayload)); //set the team information to redux
            })
            .catch (error => {
              console.log ('when get the team info in splash, error= ', error);
              dispatch (updateTeamProfile (teamPayload)); //set the team information to redux
            });
      });
    });
  } catch (error) {
    // Error retrieving data
    console.log ('Something went wrong', error);
  }
};
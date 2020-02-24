import ActionTypes from '../types';
import FireBaseApp from '../../components/config';
import AStorageManager from '../../components/asyncStorageManager';
import Utils from '../../components/utils';
import {hostUrl, getHeaders} from '../../components/apihost';
import {updateTeamProfile} from './user';

export const createTeam = (userId, name, location, navigation) => {
  return async dispatch => {
    try {
      var token = await AStorageManager.getToken ();
      var _headers = await getHeaders ();
      console.log (token);
      await fetch (hostUrl + '/team', {
        method: 'POST',
        headers: _headers,
        body: JSON.stringify ({
          uid: userId,
          name: name,
          location: location,
          token: token,
        }),
      }).then (response => {
        response.json ().then (async data => {
          var teamId = data;
          console.log ('team id when team create, ', teamId);
          await AStorageManager.setTeamId (teamId); // set the teamId in local
          fetch (hostUrl + '/user/' + userId + '/joinTeam/' + teamId, {
            method: 'POST',
            body: JSON.stringify ({
              uid: userId,
              name: name,
              position: 'Owner',
            }),
            headers: _headers,
          }).then (async response => {
            console.log ('response', response);
            var teamPayload = {
              teamId: teamId,
              teamName: name,
              role: 'owner',
              joinStatus: 0,
              isExistTeam: false,
            };
            // should update the team info in redux, by QQ
            await AStorageManager.setTeamId (teamId); //User get the newly created team's id.
            dispatch (updateTeamProfile (teamPayload));
            this.props.navigation.navigate ('TeamList');

            FireBaseApp.firestore ()
              .collection ('users')
              .doc (FireBaseApp.auth ().currentUser.uid)
              .update ({
                teamId: teamId,
              });
            navigation.navigate ('TeamList');
          });
        });
      });
    } catch (e) {
      console.log (e);
    }
  };
};

//basic functions

// function type actions

import ActionTypes from '../types';
import FireBaseApp from '../../components/config';
import AStorageManager from '../../components/asyncStorageManager';
import Utils from '../../components/utils';
import {hostUrl, getHeaders} from '../../components/apihost';

var jwtDecode = require ('jwt-decode');

export const initialize = (userId, team) => {
  return async dispatch => {
    dispatch (initializeStart ());
    
    var teamId = team.teamId;
    console.log ('when initialize teamID = ' + teamId);
    var role = team.role;
    if (Utils.isNotEmptyOrZero (teamId)) {
      var ownerId = await getOwnerId (teamId);
      if (ownerId == userId) role = 'owner';
    }
    console.log('when initialize  previous role: changed role= ', team.role, role)
    await teamListRequest (role, team, dispatch);
  };
};

/**
 * 
 * @param {*} selId // selected teamId
 * @param {*} selName //selected team name
 * @param {*} user //user info
 * @param {*} team //team info
 * @param {*} uid //firebase userId
 */
export const joinTeam = (selId, selName, user, team, uid) => {
  return async dispatch => {
    console.log ('selected id: selected name', selId + ':' + selName);
    var role = team.role;
    var userId = user.id;
    var userName = user.username;
    console.log (selId + '          ' + selName);
    dispatch (joinTeamStart ()); // loading start
    if (selId == null) {
      dispatch (joinTeamFailure ());
      return;
    }
    var ownerId = await getOwnerId (selId);
    console.log ('when join, userId: ownerId', userId, ownerId);

    if (userId == ownerId) {
      // when the user is the owner of the selected team.
      await joinTeamAsOwner (userId, selId, selName, uid, dispatch);
    } else {
      // when user want to take part in that team.
      await joinTeamAsUser (
        userId,
        userName,
        selId,
        selName,
        ownerId,
        uid,
        dispatch
      );
    }
  };
};

export const exitTeam = (selId, user, uid) => {
  return async dispatch => {
    dispatch (exitTeamStart ());
    var userId = user.id;
    exitTeamRequest (selId, userId, uid, dispatch);
  };
};

export const refreshTeamList=(team)=>{
  return async dispatch=>{
    var role = team.role;
    dispatch(refreshTeamListStart());
    teamListRequest(role, team, dispatch)
  }
}

//basic functions
/**
 * 
 * @param {number} teamId 
 */
const getOwnerId = async teamId => {
  var _headers = await getHeaders ();
  return new Promise((resolve, reject) =>{
    fetch (hostUrl + '/team/getOwnerByTeamId/' + teamId, {
      method: 'GET',
      headers: _headers,
    })
      .then (response => {
        response.json ().then (data => {
          console.log('when get owner Id', data[0], data[0].created_by);
          resolve( data[0].created_by);
        });
      })
      .catch (error => {
        console.log ('when get the owner info error: ', error);
        reject(0);
      });
  })
  
};

/**
 * 
 * @param {number} userId 
 * @param {number} selTeamId 
 * @param {string} selTeamName
 * @param {*} uid  
 * @param {*} dispatch 
 */

const joinTeamAsOwner = async (
  userId,
  selTeamId,
  selTeamName,
  uid,
  dispatch
) => {
  var _headers = await getHeaders ();
  fetch (hostUrl + '/user/' + userId + '/joinTeam/' + selTeamId, {
    method: 'POST',
    body: JSON.stringify ({
      position: 'Owner',
      join_state: 2,
    }),
    headers: _headers,
  })
    .then (async response => {
      teamPayload = {
        joinState: 2,
        isExistTeam: true,
        role: 'owner',
        teamId: selTeamId,
        teamName: selTeamName,
      };
      if (uid) {
        FireBaseApp.firestore ().collection ('users').doc (uid).update ({
          teamId: selTeamId,
        });
      } // update the firebase team information
      await AStorageManager.setTeamId (selTeamId);
      dispatch (joinTeamSuccess (teamPayload));
    })
    .catch (error => {
      console.log ('when join team as owner error: ', error);
      dispatch (joinTeamFailure ());
    });
};

/**
 * 
 * @param {number} userId 
 * @param {string} username 
 * @param {number} selTeamId 
 * @param {string} selTeamName
 * @param {number} selTeamOwnerId
 * @param {*} uid 
 * @param {*} dispatch 
 */
const joinTeamAsUser = async (
  userId,
  username,
  selTeamId,
  selTeamName,
  selTeamOwnerId,
  uid,
  dispatch
) => {
  console.log ('userid, username, selTeamName, selTeam id, owner id,  uid');
  console.log (userId, username, selTeamName, selTeamId, selTeamOwnerId, uid);
  var _headers = await getHeaders();
  fetch (hostUrl + '/user/' + userId + '/joinTeam/' + selTeamId, {
    method: 'POST',
    body: JSON.stringify ({
      position: 'none-member',
      join_state: 1,
    }),
    headers: _headers,
  }).then (async response => {
    var teamPayload = {
      isExistTeam: true,
      teamId: selTeamId,
      teamName: selTeamName,
      role: 'member',
      joinState: 1,
    };
    await AStorageManager.setTeamId(selTeamId);
    dispatch (joinTeamSuccess (teamPayload));
    var body = {
      title: '',
      ownerId: selTeamOwnerId,
      username: username,
    };
    console.log (JSON.stringify (body));
    const httpsCallable = FireBaseApp.functions ().httpsCallable ('joinNotify');
    // console.log(FireBaseApp.auth().currentUser.uid)
    httpsCallable ({some: JSON.stringify (body)})
      .then (({data}) => {
        console.log ('data.someResponse'); // hello world
        console.log (data); // hello world
      })
      .catch (httpsError => {
        console.log ('httpsError.code - ', httpsError.code); // invalid-argument
        console.log ('httpsError.message - ', httpsError.message); // Your error message goes here
      });
  });
};

/**
 * 
 * @param {number} selId 
 * @param {number} userId
 * @param {*} uid 
 * @param {*} dispatch 
 */

const exitTeamRequest = async (selId, userId, uid, dispatch) => {
  console.log('when exit team', selId, userId, uid) 
  console.log(selId, )
  var _headers = await getHeaders ();
  await fetch (hostUrl + '/user/' + userId + '/exitTeam/' + selId, {
    method: 'POST',
    body: JSON.stringify ({
      position: 'none-member',
      join_state: 0,
    }),
    headers: _headers,
  })
    .then (async response => {
      var teamPayload = {
        teamId: 0,
        teamName: '',
        role: 'none-member',
        joinState: 0,
        isExistTeam: false,
      };
      if (uid) {
        FireBaseApp.firestore ().collection ('users').doc (uid).update ({
          teamId: 0,
        });
      }
      dispatch (exitTeamSuccess (teamPayload));
      await AStorageManager.removeTeamId ();
    })
    .catch (error => {
      console.log ('exit team request failed error: ', error);
      dispatch (exitTeamFailure ());
    });
};

/**
 * 
 * @param {*} role 
 * @param {*} team 
 * @param {*} dispatch 
 */

const teamListRequest = async (role, team, dispatch) => {
  
  var _headers = await getHeaders ();
  await fetch (hostUrl + '/team', {
    method: 'GET',
    headers: _headers,
  })
    .then (response => {
      response.json ().then (data => {
        console.log('data===>', data);
        if (data.teamInfo.length != 0) {
          var teamList = data.teamInfo;
          var isExistTeam = team.isExistTeam;
          teamList.forEach (each => {
            if (each.id == team.teamId) {
              isExistTeam = true;
            }
          });
          dispatch (
            initializeSuccess ({
              teamList: teamList,
              isExistTeam: isExistTeam,
              role: role,
            })
          );
        } else {
          dispatch (
            initializeSuccess ({
              teamList: [],
              isExistTeam: false,
              role: role,
            })
          );
        }
      });
    })
    .catch (error => {
      console.log ('when get the team list error', error);
      dispatch (
        initializeFailure ({
          teamList: [],
          isExistTeam: false,
          role: role,
        })
      );
    });
};

// function type actions
function initializeStart () {
  return {
    type: ActionTypes.TEAM_INITIALIZE_START,
  };
}

const initializeFailure = () => ({
  type: ActionTypes.TEAM_INITIALIZE_FAILURE,
});

const initializeSuccess = payload => ({
  type: ActionTypes.TEAM_INITIALIZE_SUCCESS,
  payload: payload,
});

const teamListRequestStart = () => ({
  type: ActionTypes.TEAM_LIST_REQUEST_START,
});

const joinTeamStart = () => ({
  type: ActionTypes.JOIN_TEAM_START,
});

const joinTeamFailure = () => ({
  type: ActionTypes.JOIN_TEAM_FAILURE,
});

const joinTeamSuccess = payload => ({
  type: ActionTypes.JOIN_TEAM_SUCCESS,
  payload: payload,
});

const exitTeamStart = () => ({
  type: ActionTypes.EXIT_TEAM_START,
});

const exitTeamFailure = () => ({
  type: ActionTypes.EXIT_TEAM_FAILURE,
});

const exitTeamSuccess = payload => ({
  type: ActionTypes.EXIT_TEAM_SUCCESS,
  payload: payload,
});

const refreshTeamListStart = ()=>({
  type: ActionTypes.REFRESH_TEAM_LIST_START
})
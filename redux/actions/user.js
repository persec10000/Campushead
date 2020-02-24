import ActionTypes from '../types';
import FireBaseApp from '../../components/config';
import AStorageManager from '../../components/asyncStorageManager';
import Utils from '../../components/utils';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';

import {hostUrl, getHeaders} from '../../components/apihost';
var jwtDecode = require ('jwt-decode');

export const doLogin = (email, password, refs, navigation) => {
  return dispatch => {
    dispatch (loginStart ()); // login start. loading...
    FireBaseApp.auth ()
      .signInWithEmailAndPassword (email, password)
      .then (async res => {
        await sendLoginRequest (email, password, dispatch, navigation);
      })
      .catch (error => {
        if (error.message != null && typeof error.message === 'string') {
          dispatch (loginFailure ());
          refs.toast.show (error.message);
        } else {
          dispatch (loginFailure ());
        }
      });
  };
};

/**
 * register, save the user profile and token to local Storage, 
 * and reflect to redux
 *  */

export const doRegister = (email, username, password, refs, navigation) => {
  console.log (email, username, password);
  return dispatch => {
    dispatch (registerStart ());
    FireBaseApp.auth ()
      .createUserWithEmailAndPassword (email, password)
      .then (async res => {
        console.log ('=====');
        console.log (res);
        await sendRegisterRequest (
          res,
          email,
          username,
          password,
          refs,
          dispatch,
          navigation
        );
      })
      .catch (async error => {
        console.log ('----------');
        console.log (error);
        console.log ('----------');
        refs.toast.show (error.message);
        dispatch (registerFailure ());
      });
  };
};

export const googleLogin = (refs, navigation) => {
  return async dispatch => {
    try {
      await GoogleSignin.hasPlayServices ();
      const userInfo = await GoogleSignin.signIn ();
      await GoogleSignin.revokeAccess();
      console.log (userInfo);
      let _headers = new Headers ();
      // _headers.append ('Access-Control-Allow-Origin', hostUrl);
      // _headers.append ('Access-Control-Allow-Credentials', 'true');
      _headers.append ('Content-Type', 'application/json');

      var user = userInfo.user;
      console.log(user, user.email);
      console.log(user);
      fetch (hostUrl + '/user/checkEmail', {
        method: 'POST',
        body: JSON.stringify ({
          email: user.email,
        }),
        headers: _headers,
      })
        .then (response => {
          response.json ().then (async resJson => {
            console.log (resJson);
            if (resJson.isExist && resJson.error != '') {
              refs.toast.show ('Server error');
            } else if (resJson.isExist) {
              console.log ('here');
              // var password = Utils.makeRandomStr (8);
              var password = user.id;
              dispatch(doLogin (user.email, password, refs, navigation));
            } else {
              console.log ('there');
              // var password = Utils.makeRandomStr (8);
              var password = user.id;
              dispatch (
                doRegister (user.email, user.name, password, refs, navigation)
              );
            }
          });
        })
        .catch (error => {
          console.log ('check email error: ', error);
          refs.toast.show ('Something went wrong');
        });
      // this.setState({ userInfo });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        refs.toast.show ('Sign in cancelled');
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        refs.toast.show ('Sign in is in progress');
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        refs.toast.show ('play services not available');
        // play services not available or outdated
      } else {
        refs.toast.show ('Something went wrong');
        // some other error happened
      }
      console.log (error);
    }
  };
};

export const facebookLogin = (email, username, id, refs, navigation) => {
  return dispatch => {
    let _headers = new Headers ();
    _headers.append ('Access-Control-Allow-Origin', hostUrl);
    _headers.append ('Access-Control-Allow-Credentials', 'true');
    _headers.append ('Content-Type', 'application/json');

    fetch (hostUrl + '/user/checkEmail', {
      method: 'POST',
      headers: _headers,
      body: JSON.stringify ({
        email: email,
      }),
    })
      .then (response => {
        response.json ().then (async resJson => {
          console.log (resJson);
          if (resJson.isExist && resJson.error != '') {
            refs.toast.show ('Server error');
          } else if (resJson.isExist) {
            console.log ('here');
            // var password = Utils.makeRandomStr (8);
            var password = id;
            dispatch(doLogin (email, password, refs, navigation));
          } else {
            console.log ('there');
            // var password = Utils.makeRandomStr (8);
            var password = id;
            dispatch (doRegister (email, username, password, refs, navigation));
          }
        });
      })
      .catch (error => {
        console.log ('check email error: ', error);
        refs.toast.show ('Something went wrong');
      });
  };
};
// function type actions
function loginStart () {
  return {
    type: ActionTypes.LOGIN_START,
  };
}

const loginFailure = () => ({
  type: ActionTypes.LOGIN_FAILURE,
});

const loginSuccess = payload => ({
  type: ActionTypes.LOGIN_SUCCESS,
  payload: payload,
});

function registerStart () {
  return {
    type: ActionTypes.REGISTER_START,
  };
}

const registerFailure = () => ({
  type: ActionTypes.REGISTER_FAILURE,
});

const registerSuccess = payload => ({
  type: ActionTypes.REGISTER_SUCCESS,
  payload: payload,
});

export const updateProfile = payload => ({
  type: ActionTypes.UPDATE_USER_PROFILE,
  payload: payload,
});

export const updateTeamProfile = payload => ({
  type: ActionTypes.UPDATE_TEAM_PROFILE,
  payload: payload,
});

// general functions
const sendLoginRequest = async (email, password, dispatch, navigation) => {
  fetch (hostUrl + '/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify ({
      username: email,
      password: password,
    }),
  })
    .then (response => {
      response.json ().then (async data => {
        console.log ('login token data===>', data);
        token = JSON.stringify (data);
        console.log ('when set token in local', token);
        await AStorageManager.setToken (data); // save token in local
        await readUserNTeamInfo (token, dispatch, navigation); // read user and team information. preprocessing...
      });
    })
    .catch (error => {
      dispatch (loginFailure ());
    });
};

/**
 * It is called when login. read user and team info. save in local and set to redux
 * @param {string} token 
 * @param {*} dispatch 
 * @param {*} navigation 
 */
const readUserNTeamInfo = async (token, dispatch, navigation) => {
  try {
    let decoded = jwtDecode (token);
    let _headers = await getHeaders ();

    await fetch (hostUrl + '/user/get/' + decoded.user.id, {
      method: 'GET',
      headers: _headers,
    }).then (response => {
      response.json ().then (async data => {
        console.log ('when login, homeData = ', data);
        let userData = data[0];

        let userPayload = {
          id: userData.id,
          email: userData.email,
          username: userData.username,
          nickname: userData.username,
          profileURL: userData.pic,
          membership: userData.membership,
          role: userData.role,
          position: userData.position,
        };
        console.log ('userPayload:', userPayload);
        await AStorageManager.setProfile (userPayload); //save user_information in local
        dispatch (updateProfile (userPayload)); // set the user_information to redux

        if (Utils.isNotEmptyOrZero (userData.team_id)) {
          let teamPayload = {
            teamId: userData.team_id,
            teamName: '',
            isExistTeam: true,
            role: userData.role,
            joinState: userData.join_state,
            ownerId: 0,
          };

          fetch (hostUrl + '/team/getById/' + userData.team_id, {
            method: 'GET',
            headers: _headers,
          })
            .then (response => {
              response.json ().then (data => {
                var teamInfo = data.teamInfo[0];
                (teamPayload.teamName = teamInfo.name), (teamPayload.ownerId =
                  teamInfo.created_by);

                console.log ('teamPayload when read team info=', teamPayload);
              });
              dispatch (updateTeamProfile (teamPayload)); //set the team information to redux
            })
            .catch (error => {
              console.log ('when get the team info error= ', error);
              dispatch (updateTeamProfile (teamPayload)); //set the team information to redux
            });
          await AStorageManager.setTeamId (userData.team_id);
          navigation.navigate ('Home');
        } else {
          console.log ('go team list');
          await AStorageManager.removeTeamId ();
          navigation.navigate ('TeamList');
        }
      });
    });
  } catch (error) {
    // Error retrieving data
    console.log ('Something went wrong', error);
  }
};

/**
 * It is called when register. read user info not team info and save in local and set to redux
 * @param {string} token 
 * @param {*} dispatch 
 * @param {*} navigation 
 */
const readUserInfo = async (token, dispatch, navigation) => {
  try {
    let decoded = jwtDecode (token);
    let _headers = await getHeaders ();
    console.log ('decoded :', decoded);
    await fetch (hostUrl + '/user/get/' + decoded.user.id, {
      method: 'GET',
      headers: _headers,
    }).then (response => {
      response.json ().then (async data => {
        console.log ('home data = ', data);
        let userData = data[0];

        let userPayload = {
          token: token,
          profile: {
            id: userData.id,
            email: userData.email,
            username: userData.username,
            nickname: userData.username,
            profileURL: userData.pic,
            membership: userData.membership,
            role: userData.role,
            position: userData.position,
          },
        };
        await AStorageManager.setProfile (userPayload.profile); //save user_information in local
        // dispatch (updateProfile (userPayload)); // set the user_information to redux
        dispatch (registerSuccess (userPayload));
        navigation.navigate ('Teams');
      });
    });
  } catch (error) {
    // Error retrieving data
    console.log ('Something went wrong', error);
  }
};

const sendRegisterRequest = async (
  res,
  email,
  username,
  password,
  refs,
  dispatch,
  navigation
) => {
  let _headers = new Headers ();
  _headers.append ('Access-Control-Allow-Origin', hostUrl);
  _headers.append ('Access-Control-Allow-Credentials', 'true');
  _headers.append ('Content-Type', 'application/json');

  let payload = {};
  console.log (hostUrl);
  await fetch (hostUrl + '/signup', {
    method: 'POST',
    body: JSON.stringify ({
      email: email,
      username: username,
      password: password,
    }),
    headers: _headers,
  })
    .then (response => {
      response
        .json ()
        .then (async data => {
          console.log ('after register data(token) = ', data);
          decoded = jwtDecode (data);
          let token = JSON.stringify (data);
          console.log ('when set token in local', token);
          await AStorageManager.setToken (data); // save token to local
          await FireBaseApp.firestore ()
            .collection ('users')
            .doc (res.user.uid)
            .set (
              {
                authId: FireBaseApp.auth ().currentUser.uid,
                userId: 0,
                teamId: 0,
                email: email,
                username: username,
                profileURL: '',
                position: '',
                nickname: decoded.user.nickname,
              },
              {merge: true}
            );
          await readUserInfo (token, dispatch, navigation);
          // payload = {
          //   token: token,
          //   profile: {
          //     email: email,
          //     username: username,
          //     nickname: decoded.user.nickname,
          //   },
          // };

          // await AStorageManager.setProfile (payload.profile); // save the profile to local
          // dispatch (registerSuccess (payload));
          // navigation.navigate ('Teams');
        })
        .catch (function (error) {
          dispatch (registerFailure ());
          refs.toast.show (error.message);
        });
    })
    .catch (error => {
      refs.toast.show (error.message);
      dispatch (registerFailure ());
    });
};

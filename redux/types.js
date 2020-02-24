export const TEST_CHANGE = '[TEST] CHANGE';

// export const LOAD_STARTED = '[global] loading started';
// export const LOAD_ENDED = '[global] loading ended';

const LOGIN_START = '[user] login start';
const LOGIN_SUCCESS = '[user] login success';
const LOGIN_FAILURE = '[user] login failure';

const REGISTER_START = '[user] register start';
const REGISTER_SUCCESS = '[user] register success';
const REGISTER_FAILURE = '[user] register failure';

const UPDATE_USER_PROFILE = '[user] update profile';

const UPDATE_TEAM_PROFILE = '[team] update profile';
const TEAM_INITIALIZE_START = '[team] initialize start';
const TEAM_INITIALIZE_FAILURE = '[team] initialize failure';
const TEAM_INITIALIZE_SUCCESS = '[team] initialize success';
const TEAM_LIST_REQUEST_START = '[team] list request start';
const JOIN_TEAM_START = '[team] join team start';
const JOIN_TEAM_FAILURE = '[team] join team failure';
const JOIN_TEAM_SUCCESS = '[team] join team success';
const EXIT_TEAM_START = '[team] exit team start';
const EXIT_TEAM_FAILURE = '[team] exit team failure';
const EXIT_TEAM_SUCCESS = '[team] exit team success';
const TEAM_CREATE_SONG_START = '[team] create song start';
const TEAM_CREATE_SONG_FAILURE ='[team] create song failure';
const TEAM_CREATE_SONG_SUCCESS = '[team] create song success';
const REFRESH_TEAM_LIST_START = '[team] refresh team list';

const SBT_LIST_INITIALIZE_START = '[sbt] initialize start';
const REFRESH_SBT_LIST_START = '[sbt] refresh songs of focus list start';
const GET_SBT_LIST_FAILURE = '[sbt] get sbt list failure';
const GET_SBT_LIST_SUCCESS = '[sbt] get sbt list success';
const ADD_SBT_SUCCESS = '[sbt] add sbt success';
const ADD_SBT_FAILURE = '[sbt] add sbt failure';
const REMOVE_SBT_SUCCESS = '[sbt] remove sbt success';
const REMOVE_SBT_FAILURE = '[sbt] remove sbt failure';
// export const CREATE_SONG = '[team] create song';
// export const UPDATE_TEAM_INFO = '[team] update information';

// export const TEAM_MEMBER_RETRIEVE_STARTED = "[team member] retrieve started";
// export const TEAM_MEMBER_RETRIEVE_FAILED = "[team member] retrieve failed";
// export const TEAM_MEMBER_RETRIEVE_SUCCESS = "[team member] retrieve success";
// export const TEAM_MEMBER_REFRESH_STARTED = '[team member] refresh started';

// const HOME_DATA_RETRIEVE_STARTED = '[home] retrieve started';
// const HOME_RETRIEVE_FAILED = '[home] retrieve started';
// const HOME_RETRIEVE_SUCCESS = '[home] retrieve success';
// const READ_POST_DATA_STARTED = '[home] read post data started';
// const READ_POST_DATA_FAILED = '[home] read post data failed';
// const READ_POST_DATA_SUCCESS = '[home] read post data success';
// const READ_TEAM_INFO_SUCCESS = '[home] read team info success';

// const READ_USER_INFO_STARTED = '[profile] read user info started';
// const READ_USER_INFO_FAILED = '[profile] read user info failed';
// const READ_USER_INFO_SUCCESS = '[profile] read user info success';


export default (ActionTypes = {
  TEST_CHANGE: TEST_CHANGE,

//   LOAD_STARTED: LOAD_STARTED,
//   LOAD_ENDED: LOAD_ENDED,

  LOGIN_START: LOGIN_START,
  LOGIN_SUCCESS: LOGIN_SUCCESS,
  LOGIN_FAILURE: LOGIN_FAILURE,


  REGISTER_START: REGISTER_START,
  REGISTER_SUCCESS: REGISTER_SUCCESS,
  REGISTER_FAILURE: REGISTER_FAILURE,


  UPDATE_USER_PROFILE: UPDATE_USER_PROFILE,


  UPDATE_TEAM_PROFILE: UPDATE_TEAM_PROFILE,
  TEAM_INITIALIZE_START: TEAM_INITIALIZE_START,
  TEAM_INITIALIZE_FAILURE: TEAM_INITIALIZE_FAILURE,
  TEAM_INITIALIZE_SUCCESS: TEAM_INITIALIZE_SUCCESS,
  TEAM_LIST_REQUEST_START: TEAM_LIST_REQUEST_START,
  JOIN_TEAM_START: JOIN_TEAM_START,
  JOIN_TEAM_FAILURE: JOIN_TEAM_FAILURE,
  JOIN_TEAM_SUCCESS: JOIN_TEAM_SUCCESS,

  EXIT_TEAM_START: EXIT_TEAM_START,
  EXIT_TEAM_FAILURE: EXIT_TEAM_FAILURE,
  EXIT_TEAM_SUCCESS: EXIT_TEAM_SUCCESS,

  TEAM_CREATE_SONG_START: TEAM_CREATE_SONG_START,
  TEAM_CREATE_SONG_FAILURE: TEAM_CREATE_SONG_FAILURE,
  TEAM_CREATE_SONG_SUCCESS: TEAM_CREATE_SONG_SUCCESS,
  
  REFRESH_TEAM_LIST_START: REFRESH_TEAM_LIST_START,


  SBT_LIST_INITIALIZE_START: SBT_LIST_INITIALIZE_START,
  REFRESH_SBT_LIST_START: REFRESH_SBT_LIST_START,
  GET_SBT_LIST_FAILURE: GET_SBT_LIST_FAILURE,
  GET_SBT_LIST_SUCCESS: GET_SBT_LIST_SUCCESS,
  ADD_SBT_SUCCESS: ADD_SBT_SUCCESS,
  ADD_SBT_FAILURE: ADD_SBT_FAILURE,
  REMOVE_SBT_SUCCESS: REMOVE_SBT_SUCCESS,
  REMOVE_SBT_FAILURE: REMOVE_SBT_FAILURE,
//   HOME_DATA_RETRIEVE_STARTED: HOME_DATA_RETRIEVE_STARTED,
//   HOME_RETRIEVE_FAILED: HOME_RETRIEVE_FAILED,
//   HOME_RETRIEVE_SUCCESS:HOME_RETRIEVE_SUCCESS,
//   READ_POST_DATA_STARTED: READ_POST_DATA_STARTED,
//   READ_POST_DATA_FAILED: READ_POST_DATA_FAILED,
//   READ_POST_DATA_SUCCESS: READ_POST_DATA_SUCCESS,
//   READ_TEAM_INFO_SUCCESS: READ_TEAM_INFO_SUCCESS,

//   TEAM_RETRIEVE_STARTED: TEAM_RETRIEVE_STARTED,
//   TEAM_RETRIEVE_SUCCESS: TEAM_RETRIEVE_SUCCESS,
//   TEAM_RETRIEVE_FAILED: TEAM_RETRIEVE_FAILED,
//   JOIN_TEAM_STARTED: JOIN_TEAM_STARTED,
//   JOIN_TEAM_SUCCESS: JOIN_TEAM_SUCCESS,
//   JOIN_TEAM_FAILED: JOIN_TEAM_FAILED,
//   CREATE_SONG: CREATE_SONG,
//   UPDATE_TEAM_INFO: UPDATE_TEAM_INFO,
  
//   TEAM_MEMBER_RETRIEVE_STARTED: TEAM_MEMBER_RETRIEVE_STARTED,
//   TEAM_MEMBER_RETRIEVE_FAILED: TEAM_MEMBER_RETRIEVE_FAILED,
//   TEAM_MEMBER_RETRIEVE_SUCCESS: TEAM_MEMBER_RETRIEVE_SUCCESS,
//   TEAM_MEMBER_REFRESH_STARTED: TEAM_MEMBER_REFRESH_STARTED,


//   READ_USER_INFO_STARTED: READ_USER_INFO_STARTED,
//   READ_USER_INFO_FAILED: READ_USER_INFO_FAILED,
//   READ_USER_INFO_SUCCESS: READ_USER_INFO_SUCCESS,

});

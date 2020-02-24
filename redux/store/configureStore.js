import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import testReducer from '../reducers/testReducer';
import userReducer from '../reducers/userReducer';
import teamReducer from '../reducers/teamReducer';
import sbtReducer  from '../reducers/sbtReducer';
const rootReducer = combineReducers ({
  test: testReducer,
  user: userReducer,
  team: teamReducer,
  sbt : sbtReducer,
});

const configureStore = () => {
  return createStore (rootReducer, applyMiddleware (thunk));
};

export default configureStore;

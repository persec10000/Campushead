import * as Actions from '../actions/index';

const initialState = {
    count: 0
}

const testReducer = (state = initialState, action) => {
    switch (action.type) {
        case Actions.TEST_CHANGE:
            return {
                ...state,
                count: action.payload
            };
        default:
            return initialState;
    }
}

export default testReducer;
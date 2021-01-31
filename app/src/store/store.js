import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';


const rootReducer = combineReducers( (payload) => ({
    type: "GET_USERS_POSTS",
    payload
}));

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;
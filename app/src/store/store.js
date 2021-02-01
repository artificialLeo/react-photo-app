import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import {
    reducer as dataReducer,
    DATA as dataModule,
    USER as userModule,
    POST_DATA as postsModule
} from './actions'

const rootReducer = combineReducers({
    [dataModule]: dataReducer,
    [userModule]: dataReducer,
    [postsModule]: dataReducer
});

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;
import { combineReducers } from 'redux';

import { uiReducer } from './ui.reducer';
import { userReducer } from './user.reducer';

/*#############################################################|
|                        REDUCERS
*##############################################################*/
// tslint:disable-next-line: no-default-export
export default combineReducers({
  userReducer,
  uiReducer
});

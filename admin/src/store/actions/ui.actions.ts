import { SET_LOADING, SET_MESSAGE, TOGGLE_MODAL } from '../reducers/ui.reducer';

export const setLoading = (
  status: boolean,
  key: string = "default"
) => dispatch => {
  // status regulates if we're in a loading state or not (useful for triggering the loading)
  // key is used to set a loading bar to only certain elements (like BlockButton for example), if needed.

  dispatch({
    type: SET_LOADING,
    payload: {
      status,
      key
    }
  });
};

export interface IMessage {
  message: string;
  onDismiss?: () => any;
  onPress?: () => any;
}

export const showMessage = (messageObject: IMessage) => dispatch => {
  dispatch({
    type: SET_MESSAGE,
    payload: messageObject
  });
};

export const toggleModal = (key: string, isOpen: boolean) => (dispatch: any) => {
  dispatch({
    type: TOGGLE_MODAL,
    payload: {
      key,
      isOpen
    }
  })
}
 
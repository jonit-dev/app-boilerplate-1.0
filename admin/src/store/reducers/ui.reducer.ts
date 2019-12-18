export interface IUIReducer {
  isLoading: object;
}

const INITIAL_STATE = {
  isLoading: {
    status: false,
    key: null
  },
  alert: {
    message: null,
    onPress: () => null,
    onDismiss: () => null
  }
};

// tslint:disable-next-line: no-default-export
export const uiReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        isLoading: {
          status: action.payload.status,
          key: action.payload.key
        }
      };

    case SET_MESSAGE:
      return {
        ...state,
        alert: action.payload
      };

    case CLEAR_MESSAGE:
      return {
        ...state,
        alert: INITIAL_STATE.alert
      };

    default:
      return state;
  }
};

// Types ========================================

export const SET_LOADING = "SET_LOADING";
export const SET_MESSAGE = "SET_ERROR";
export const CLEAR_MESSAGE = "CLEAR_MESSAGE";

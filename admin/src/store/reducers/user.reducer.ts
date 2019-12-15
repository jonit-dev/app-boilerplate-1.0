const INITIAL_STATE = {
  user: null,
  test: "hi there"
};

export const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case USER_REGISTER:
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

export const USER_REGISTER = "USER_REGISTER";

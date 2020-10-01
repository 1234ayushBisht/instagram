import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import {
  GET_ERRORS,
  SET_CURRENT_USER,
  USER_LOADING
} from "./types";
import M from 'materialize-css';

// Login - get user token
export const loginUser = userData => dispatch => {
  axios
    .post("/api/login", userData)
    .then(res => {
      if (res.data.error) {
        return M.toast({ html: res.data.error, classes: 'danger' })
      }
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      
      setAuthToken(token);

      const decoded = jwt_decode(token);

      dispatch(setCurrentUser(decoded));
      M.toast({ html: 'Logged In Scuccessfully', classes: 'success' })
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};

// Log user out
export const logoutUser = () => dispatch => {

  localStorage.removeItem("jwtToken");
  localStorage.removeItem("user")

  setAuthToken(false);

  dispatch(setCurrentUser({}));
  M.toast({ html: "Logged Out Successfully.", classes: "success" })
};
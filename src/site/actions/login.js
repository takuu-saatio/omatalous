"use strict";

export const LOGIN = 'LOGIN'
export const REGISTER = 'REGISTER'

export function login() {
  return {
    type: LOGIN
  }
}

export function register() {
  return {
    type: REGISTER
  }
}

export function loginOrRegister() {

  return (dispatch, getState) => {
    
    const state = getState();
    let status = state.login;
    
    if (status === 'initialized') {
      dispatch(login());
    } else if (status === 'new') {
      dispatch(register());
    } else if (status === 'loggedIn') {
      console.log('logged in, move on');
    } else {
      console.log('unsupported status');
    }
  
  }

}

export function incrementAsync(delay = 1000) {
  return dispatch => {
    setTimeout(() => {
      dispatch(loginOrRegister())
    }, delay)
  }
}

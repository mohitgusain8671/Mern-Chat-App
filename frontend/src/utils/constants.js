export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = 'api/v1/auth'
export const SIGNUP_ROUTES = `${AUTH_ROUTES}/register`
export const LOGIN_ROUTES = `${AUTH_ROUTES}/login`
export const GET_USER_INFO = `${AUTH_ROUTES}/user-info`
export const UPDATE_PROFILE_ROUTES = `${AUTH_ROUTES}/update-profile`;
export const ADD_PROFILE_IMAGE_ROUTES = `${AUTH_ROUTES}/add-image`;
export const REMOVE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/remove-image`;


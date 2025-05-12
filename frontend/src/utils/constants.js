export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = 'api/v1/auth'
export const SIGNUP_ROUTES = `${AUTH_ROUTES}/register`
export const LOGIN_ROUTES = `${AUTH_ROUTES}/login`
export const GET_USER_INFO = `${AUTH_ROUTES}/user-info`


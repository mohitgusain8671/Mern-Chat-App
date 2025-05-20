export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = 'api/v1/auth'
export const SIGNUP_ROUTES = `${AUTH_ROUTES}/register`
export const LOGIN_ROUTES = `${AUTH_ROUTES}/login`
export const LOGOUT_ROUTES = `${AUTH_ROUTES}/logout`
export const GET_USER_INFO = `${AUTH_ROUTES}/user-info`
export const UPDATE_PROFILE_ROUTES = `${AUTH_ROUTES}/update-profile`;
export const ADD_PROFILE_IMAGE_ROUTES = `${AUTH_ROUTES}/add-image`;
export const REMOVE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/remove-image`;

export const CONTACT_ROUTES = 'api/v1/contacts'
export const SEARCH_CONTACTS = `${CONTACT_ROUTES}/search`
export const GET_DM_CONTACTS = `${CONTACT_ROUTES}/dm-contacts`
export const GET_ALL_CONTACTS = `${CONTACT_ROUTES}/get-all-contacts`

export const MESSAGES_ROUTES = 'api/v1/messages'
export const GET_MESSAGES = `${MESSAGES_ROUTES}/get-messages`
export const UPLOAD_FILE_MESSAGE = `${MESSAGES_ROUTES}/upload-file`

export const CHANNEL_ROUTES = `api/v1/channels`
export const CREATE_CHANNEL = `${CHANNEL_ROUTES}/create-channel`
export const GET_USER_CHANNELS = `${CHANNEL_ROUTES}/get-user-channels`




/**
 * Auth
 */
export const AUTH_LOGIN                       = 'AUTH_LOGIN';
export const AUTH_LOGIN_SUCCESS               = 'AUTH_LOGIN_SUCCESS';
export const AUTH_LOGIN_FAILED                = 'AUTH_LOGIN_FAILED';

export const AUTH_ADMIN_LOGIN                 = 'AUTH_ADMIN_LOGIN';
export const AUTH_ADMIN_LOGIN_SUCCESS         = 'AUTH_ADMIN_LOGIN_SUCCESS';
export const AUTH_ADMIN_LOGIN_FAILED          = 'AUTH_ADMIN_LOGIN_FAILED';

export const AUTH_FACEBOOK_LOGIN              = 'AUTH_FACEBOOK_LOGIN';
export const AUTH_GOOGLE_LOGIN                = 'AUTH_GOOGLE_LOGIN';

export const AUTH_SIGNUP                      = 'AUTH_SIGNUP';
export const AUTH_SIGNUP_SUCCESS              = 'AUTH_SIGNUP_SUCCESS';
export const AUTH_SIGNUP_FAILED               = 'AUTH_SIGNUP_FAILED';

export const AUTH_ACTIVATE                    = 'AUTH_ACTIVATE';

export const AUTH_FORGOT_PASSWORD             = 'AUTH_FORGOT_PASSWORD';
export const AUTH_FORGOT_PASSWORD_SUCCESS     = 'AUTH_FORGOT_PASSWORD_SUCCESS';
export const AUTH_FORGOT_PASSWORD_FAILED      = 'AUTH_FORGOT_PASSWORD_FAILED';

export const AUTH_LOGOUT                      = 'AUTH_LOGOUT';
export const AUTH_LOGOUT_SUCCESS              = 'AUTH_LOGOUT_SUCCESS';

export const AUTH_UPDATE_TOKEN                = 'AUTH_UPDATE_TOKEN';
export const AUTH_EXPIRED                     = 'AUTH_EXPIRED';
export const AUTH_SCHEDULE_UPDATE_TOKEN       = 'AUTH_SCHEDULE_UPDATE_TOKEN';

export const AUTH_UPDATE_PROFILE							= 'AUTH_UPDATE_PROFILE';

/**
 * Reaction
 */
export const DO_REACTION  										= 'DO_REACTION';
export const DO_REACTION_SUCCESS							= 'DO_REACTION_SUCCESS';
export const DO_REACTION_FAIL									= 'DO_REACTION_FAIL';

/**
 * Comment
 */
export const LEAVE_COMMENT  									= 'LEAVE_COMMENT';

/**
 * Doctor
 */
export const GET_DOCTOR_LIST  								= 'GET_DOCTOR_LIST';
export const GET_DOCTOR_LIST_SUCCESS					= 'GET_DOCTOR_LIST_SUCCESS';
export const GET_DOCTOR_LIST_FAIL							= 'GET_DOCTOR_LIST_FAIL';

/**
 * Patient
 */
export const GET_PATIENT_LIST  								= 'GET_PATIENT_LIST';
export const GET_PATIENT_LIST_SUCCESS					= 'GET_PATIENT_LIST_SUCCESS';
export const GET_PATIENT_LIST_FAIL						= 'GET_PATIENT_LIST_FAIL';


// POST

export const GET_My_POST_LIST                 = 'GET_My_POST_LIST';
export const GET_My_POST_LIST_SUCCESS					= 'GET_My_POST_LIST_SUCCESS';
export const GET_My_POST_LIST_FAIL						= 'GET_My_POST_LIST_FAIL';

export const GET_POSTS_LIST                   = 'GET_POSTS_LIST';
export const GET_POSTS_LIST_SUCCESS					  = 'GET_POSTS_LIST_SUCCESS';
export const GET_POSTS_LIST_FAIL							= 'GET_POSTS_LIST_FAIL';

// Article

export const GET_MY_ARTICLE_LIST              = 'GET_MY_ARTICLE_LIST';
export const GET_MY_ARTICLE_SUCCESS						= 'GET_MY_ARTICLE_SUCCESS';
export const GET_MY_ARTICLE_FAIL							= 'GET_MY_ARTICLE_FAIL';

export const UPDATE_ARTICLE                   = 'UPDATE_ARTICLE';

export const GET_ARTICLES_LIST                = 'GET_ARTICLES_LIST';
export const GET_ARTICLES_LIST_SUCCESS				= 'GET_ARTICLES_LIST_SUCCESS';
export const GET_ARTICLES_LIST_FAIL						= 'GET_ARTICLES_LIST_FAIL';

// Good

export const GET_MY_GOOD_LIST              		= 'GET_MY_GOOD_LIST';
export const GET_MY_GOOD_SUCCESS							= 'GET_MY_GOOD_SUCCESS';
export const GET_MY_GOOD_FAIL									= 'GET_MY_GOOD_FAIL';

export const GET_GOOD_LIST                		= 'GET_GOOD_LIST';
export const GET_GOOD_LIST_SUCCESS						= 'GET_GOOD_LIST_SUCCESS';
export const GET_GOOD_LIST_FAIL								= 'GET_GOOD_LIST_FAIL';

// Good

export const GET_ACTIVE_PAYMENT            		= 'GET_ACTIVE_PAYMENT';
export const GET_ACTIVE_PAYMENT_SUCCESS				= 'GET_ACTIVE_PAYMENT_SUCCESS';
export const GET_ACTIVE_PAYMENT_FAIL					= 'GET_ACTIVE_PAYMENT_FAIL';

/**
 * Sidebar
 */
export const SIDEBAR_TOGGLE                   = 'SIDEBAR_TOGGLE';

//HeartRate

export const GET_HEARTRATE_LIST               = 'GET_HEARTRATE_LIST';
export const GET_HEARTRATE_LIST_SUCCESS				= 'GET_HEARTRATE_LIST_SUCCESS';
export const GET_HEARTRATE_LIST_FAIL					= 'GET_HEARTRATE_LIST_FAIL';

export const GET_STEPS_LIST                   = 'GET_STEPS_LIST';
export const GET_STEPS_LIST_SUCCESS					  = 'GET_STEPS_LIST_SUCCESS';
export const GET_STEPS_LIST_FAIL							= 'GET_STEPS_LIST_FAIL';

export const GET_WEIGHT_LIST                  = 'GET_WEIGHT_LIST';
export const GET_WEIGHT_LIST_SUCCESS					= 'GET_WEIGHT_LIST_SUCCESS';
export const GET_WEIGHT_LIST_FAIL							= 'GET_WEIGHT_LIST_FAIL';

export const GET_ALCOHOL_USE_LIST             = 'GET_ALCOHOL_USE_LIST';
export const GET_ALCOHOL_USE_LIST_SUCCESS			= 'GET_ALCOHOL_USE_LIST_SUCCESS';
export const GET_ALCOHOL_USE_LIST_FAIL				= 'GET_ALCOHOL_USE_LIST_FAIL';

export const GET_HEARTPRESSURE_LIST           = 'GET_HEARTPRESSURE_LIST';
export const GET_HEARTPRESSURE_LIST_SUCCESS		= 'GET_HEARTPRESSURE_LIST_SUCCESS';
export const GET_HEARTPRESSURE_LIST_FAIL			= 'GET_HEARTPRESSURE_LIST_FAIL';


export const GET_ENERGY_LIST                  = 'GET_ENERGY_LIST';
export const GET_ENERGY_LIST_SUCCESS					= 'GET_ENERGY_LIST_SUCCESS';
export const GET_ENERGY_LIST_FAIL							= 'GET_ENERGY_LIST_FAIL';

export const GET_EXERCISE_LIST                = 'GET_EXERCISE_LIST';
export const GET_EXERCISE_LIST_SUCCESS				= 'GET_EXERCISE_LIST_SUCCESS';
export const GET_EXERCISE_LIST_FAIL						= 'GET_EXERCISE_LIST_FAIL';


export const GET_STAND_LIST                   = 'GET_STAND_LIST';
export const GET_STAND_LIST_SUCCESS					  = 'GET_STAND_LIST_SUCCESS';
export const GET_STAND_LIST_FAIL							= 'GET_STAND_LIST_FAIL';

export const GET_SLEEP_LIST                   = 'GET_SLEEP_LIST';
export const GET_SLEEP_LIST_SUCCESS					  = 'GET_SLEEP_LIST_SUCCESS';
export const GET_SLEEP_LIST_FAIL							= 'GET_SLEEP_LIST_FAIL';

export const GET_ECG_LIST                     = 'GET_ECG_LIST';
export const GET_ECG_LIST_SUCCESS					    = 'GET_ECG_LIST_SUCCESS';
export const GET_ECG_LIST_FAIL							  = 'GET_ECG_LIST_FAIL';

//add

export const ADD_STEP                         = 'ADD_STEP';
export const ADD_STEP_SUCCESS					        = 'ADD_STEP_SUCCESS';
export const ADD_STEP_FAIL							      = 'ADD_STEP_FAIL';

export const ADD_HEART_RATE                   = 'ADD_HEART_RATE';
export const ADD_HEART_RATE_SUCCESS					  = 'ADD_HEART_RATE_SUCCESS';
export const ADD_HEART_RATE_FAIL							= 'ADD_HEART_RATE_FAIL';

export const ADD_WEIGHT                       = 'ADD_WEIGHT';
export const ADD_WEIGHT_SUCCESS					      = 'ADD_WEIGHT_SUCCESS';
export const ADD_WEIGHT_FAIL							    = 'ADD_WEIGHT_FAIL';


export const ADD_ALCOHOL                      = 'ADD_ALCOHOL';
export const ADD_ALCOHOL_SUCCESS					    = 'ADD_ALCOHOL_SUCCESS';
export const ADD_ALCOHOL_FAIL							    = 'ADD_ALCOHOL_FAIL';

export const ADD_HEAERT_PRESSURE               = 'ADD_HEAERT_PRESSURE';
export const ADD_HEAERT_PRESSURE_SUCCESS				= 'ADD_HEAERT_PRESSURE_SUCCESS';
export const ADD_HEAERT_PRESSUREL_FAIL					= 'ADD_HEAERT_PRESSUREL_FAIL';

export const ADD_ENERGY                       = 'ADD_ENERGY';
export const ADD_ENERGY_SUCCESS					      = 'ADD_ENERGY_SUCCESS';
export const ADD_ENERGY_FAIL							    = 'ADD_ENERGY_FAIL';


export const ADD_EXERCISE                     = 'ADD_EXERCISE';
export const ADD_EXERCISE_SUCCESS					    = 'ADD_EXERCISE_SUCCESS';
export const ADD_EXERCISE_FAIL							  = 'ADD_EXERCISE_FAIL';


export const ADD_STAND                        = 'ADD_STAND';
export const ADD_STAND_SUCCESS					      = 'ADD_STAND_SUCCESS';
export const ADD_STAND_FAIL							      = 'ADD_STAND_FAIL';

export const ADD_SLEEP                        = 'ADD_SLEEP';
export const ADD_SLEEP_SUCCESS					      = 'ADD_SLEEP_SUCCESS';
export const ADD_SLEEP_FAIL							      = 'ADD_SLEEP_FAIL';

/**
 * User
 */
export const GET_USER_LIST  								  = 'GET_USER_LIST';
export const GET_USER_LIST_SUCCESS					  = 'GET_USER_LIST_SUCCESS';
export const GET_USER_LIST_FAIL							  = 'GET_USER_LIST_FAIL';

export const MODIFY_USER                      = 'MODIFY_USER';

export const SET_USER_TABLE_INFO              = 'SET_USER_TABLE_INFO';
export const SET_DOCTOR_TABLE_INFO            = 'SET_DOCTOR_TABLE_INFO';

/**
 * Logo
 */
export const GET_LOGO  								        = 'GET_LOGO';
export const GET_LOGO_SUCCESS					        = 'GET_LOGO_SUCCESS';

/**
 * Category
 */
export const GET_CATEGORY  								    = 'GET_CATEGORY';
export const GET_CATEGORY_SUCCESS					    = 'GET_CATEGORY_SUCCESS';
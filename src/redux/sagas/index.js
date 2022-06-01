import { all, fork } from 'redux-saga/effects';

import { watchSignin, watchSignup, watchActivate, watchSignout, watchScheduleUpdateToken, watchFacebookLogin, watchGoogleLogin, watchAdminSignin } from './auth';
import { watchGetDoctors } from './doctor';
import { watchGetPatients } from './patient';
import { watchGetMyPost, watchGetPosts } from './post';
import { watchGetHeartRate,watchGetSteps,watchGetWeight,watchgetAlcoholUse,watchgetHeartPressure,watchaddStep,watchaddHeartRate,watchaddWeight, watchaddAlohol,watchaddHeartPressure, watchgetEnergy, watchgetExercise, watchgetSleep ,watchgetStand, watchaddStand, watchaddEnergy, watchaddExercise,watchaddSleep, watchGetECG} from './heartRate';
import { watchReaction } from './reaction';
import { watchGetArticles, watchGetMyArticles, watchUpdateArticle } from './article';
import { watchGetGoods, watchGetMyGoods } from './good';
import { watchGetActivePayment } from './subscribe';
import { watchGetUsers } from './user';
import { watchGetLogo } from './media';
import { watchGetCategories } from './category';
export default function* rootSaga() {
  yield all([
    // auth
    fork(watchSignin),
    fork(watchSignup),
    fork(watchActivate),
    fork(watchSignout),
		fork(watchScheduleUpdateToken),
		fork(watchFacebookLogin),
		fork(watchGoogleLogin),
		fork(watchAdminSignin),

		// post
		fork(watchGetMyPost),
		fork(watchGetPosts),
		
		// article
		fork(watchGetMyArticles),
    fork(watchGetArticles),
    fork(watchUpdateArticle),

		// good
		fork(watchGetGoods),
		fork(watchGetMyGoods),

		//reaction
		fork(watchReaction),

		//subscribe
		fork(watchGetActivePayment),
		
		// doctor
    fork(watchGetDoctors),
    // Patient
    fork(watchGetPatients),
    fork(watchGetHeartRate),
    fork(watchGetSteps),
    fork(watchGetWeight),
    fork(watchgetAlcoholUse),
    fork(watchgetHeartPressure),
    fork(watchaddStep),
    fork(watchaddHeartRate),
    fork(watchaddWeight),
    fork(watchaddAlohol),
    fork(watchaddHeartPressure),
    fork(watchgetEnergy),
    fork(watchgetStand),
    fork(watchgetExercise),
    fork(watchgetSleep),
    fork(watchaddStand),
    fork(watchaddEnergy),
    fork(watchaddExercise),
    fork(watchaddSleep),
    fork(watchGetECG),

    //User
    fork(watchGetUsers),

    // Logo
    fork(watchGetLogo),

    // Category
    fork(watchGetCategories)
  ]);
}
import { combineReducers } from 'redux';

import auth from './auth';
import doctor from './doctor';
import patient from './patient';
import post from './post';
import heartRate from './heartRate'
import article from './article';
import good from './good';
import subscribe from './subscribe';
import sidebar from './sidebar';
import user from './user';
import media from './media';
import category from './category';

export default combineReducers ({
  auth,
	doctor,
	patient,
	post,
	heartRate,
	article,
	good,
	subscribe,
	sidebar,
	user,
	media,
	category
})
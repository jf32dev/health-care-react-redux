import {
	 DO_REACTION, DO_REACTION_FAIL, DO_REACTION_SUCCESS
} from '../type';
import { takeLatest, put } from 'redux-saga/effects';
import {
	reaction as reactionApi,
} from '../../api';

function* reaction(payload){
	try {
		const { relation_id, type, value } = payload.data;
		const result = yield reactionApi(relation_id, type, value)
		if (result && result.data) {
			yield put({ type: DO_REACTION_SUCCESS, data: { ...result.data, postID : type === 3 ? payload.data.postID : 0} })
		} else {
			if (result && result.errors) {
				yield put({ type: DO_REACTION_FAIL, errors: [] })
			} else {
				yield put({ type: DO_REACTION_FAIL, errors: [] })
			}
		}
	} catch (err) {
		yield put({ type: DO_REACTION_FAIL, errors: [err] })
	}
}

export function* watchReaction(){
	yield takeLatest(DO_REACTION, reaction)
}
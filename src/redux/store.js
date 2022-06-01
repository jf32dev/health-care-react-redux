import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import rootReducer from './reducers';
import sagas from './sagas';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['notification', 'sidebar'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export function initializeStore() {
	const sagaMiddleware = createSagaMiddleware();

  let store = createStore(
		persistedReducer,
		applyMiddleware(sagaMiddleware)
	);
	let persistor = persistStore(store);
	
	sagaMiddleware.run(sagas);

  return { store, persistor }
}
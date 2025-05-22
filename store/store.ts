import { configureStore } from '@reduxjs/toolkit';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const createSagaMiddleware = require('redux-saga').default;
import { rootSaga } from './rootSaga';
import authReducer from './auth/authSlice'
import portfolioReducer from './portfolio/portfolioSlice'

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    auth : authReducer,
    portfolio : portfolioReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export default store;
import { all } from 'redux-saga/effects'
import * as authSaga from './auth/authSaga'

export function* rootSaga() {
  yield all([
    authSaga.authWatcher()
  ])
}
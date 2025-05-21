import { all } from 'redux-saga/effects'
import * as authSaga from './auth/authSaga'
import * as portfolioSaga from './portfolio/portfolioSaga'

export function* rootSaga() {
  yield all([
    authSaga.authWatcher(),
    portfolioSaga.portfolioWatcher()
  ])
}
import { all } from "redux-saga/effects";
import * as authSaga from "./auth/authSaga";
import * as portfolioSaga from "./portfolio/portfolioSaga";
import * as analyticsSaga from "./analytics/analyticsSaga";
import * as recommendSaga from "./recommend/recommendSaga";

export function* rootSaga() {
  yield all([
    authSaga.authWatcher(),
    portfolioSaga.portfolioWatcher(),
    analyticsSaga.analyticsWatcher(),
    recommendSaga.recommendWatcher(),
  ]);
}

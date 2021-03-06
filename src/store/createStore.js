import { applyMiddleware, compose, createStore } from 'redux';
// import thunk from 'redux-thunk'
// import { browserHistory } from 'react-router'
// import { updateLocation } from './location'
import createSagaMiddleware from 'redux-saga';
import { makeRootReducer } from './reducers';

const sagaMiddleware = createSagaMiddleware();

export default (initialState = {}) => {
  // ======================================================
  // Middleware Configuration
  // ======================================================
  // const middleware = [thunk]
  const middleware = [sagaMiddleware];

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = [];
  // if (__DEV__) {
  //   const devToolsExtension = window.devToolsExtension
  //   if (typeof devToolsExtension === 'function') {
  //     enhancers.push(devToolsExtension())
  //   }
  // }

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const store = createStore(
    makeRootReducer(),
    initialState,
    compose(
      applyMiddleware(...middleware),
      ...enhancers,
      window.devToolsExtension ? window.devToolsExtension() : f => f,
    ),
  );

  // Extensions
  store.runSaga = sagaMiddleware.run;
  store.injectedReducers = {};
  store.injectedSagas = {}; // Saga registry

  // To unsubscribe, invoke `store.unsubscribeHistory()` anytime
  // store.unsubscribeHistory = browserHistory.listen(updateLocation(store))

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const reducers = require('./reducers').default;
      store.replaceReducer(reducers(store.injectedReducers));
    });
  }

  return store;
};

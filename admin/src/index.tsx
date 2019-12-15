import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';

import App from './App';
import * as serviceWorker from './serviceWorker';
import reducers from './store/reducers/index.reducers';

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, composeEnhancers(applyMiddleware()));

serviceWorker.unregister();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,

  document.querySelector("#root")
);

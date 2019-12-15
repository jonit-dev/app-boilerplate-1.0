import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import history from './router/history';
import { AboutScreen } from './screens/about.screen';
import { IndexScreen } from './screens/index.screen';

const App: React.FC = () => {
  return (
    <BrowserRouter history={history}>
      <>
        <Switch>
          <Route path="/" exact component={IndexScreen} />
          <Route path="/about" component={AboutScreen} />
        </Switch>
      </>
    </BrowserRouter>
  );
};

export default App;

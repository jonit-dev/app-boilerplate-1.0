import './App.css';

import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Header } from './components/Header';
import history from './router/history';
import { AboutScreen } from './screens/About.screen';
import { IndexScreen } from './screens/Index.screen';
import { UsersScreen } from './screens/Users.screen';

const App: React.FC = () => {
  return (
    <BrowserRouter history={history}>
      <Header title="Dashboard">
        <Switch>
          <Route path="/" exact component={IndexScreen} />
          <Route path="/about" component={AboutScreen} />
          <Route path="/users" component={UsersScreen} />
        </Switch>
      </Header>
    </BrowserRouter>
  );
};

// tslint:disable-next-line: no-default-export
export default App;

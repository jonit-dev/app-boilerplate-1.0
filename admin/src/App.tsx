import './App.css';

import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Header } from './components/Header';
import history from './router/history';
import { LoginScreen } from './screens/Auth/Login.screen';
import { AboutScreen } from './screens/Dashboard/About.screen';
import { IndexScreen } from './screens/Dashboard/Index.screen';
import { UsersScreen } from './screens/Dashboard/Users.screen';

const App: React.FC = () => {
  // this function decides which path the user should take initially.. wether its login or do straight to the dashboard if he already logged in before

  const AuthToken = localStorage.getItem("token");

  if (!AuthToken) {
    // If user is not logged in... redirect to auth
    return <LoginScreen />;
  }

  return (
    <BrowserRouter history={history}>
      <Header title="Dashboard">
        <Switch>
          <Route path="/" exact component={IndexScreen} />
          <Route path="/dashboard" exact component={IndexScreen} />
          <Route path="/about" component={AboutScreen} />
          <Route path="/users" component={UsersScreen} />
        </Switch>
      </Header>
    </BrowserRouter>
  );
};

// tslint:disable-next-line: no-default-export
export default App;

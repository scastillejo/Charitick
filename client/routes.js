import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/App';
import SignupPage from './components/signup/SignupPage';
import LoginPage from './components/login/LoginPage';
import DonatePage from './components/donation/DonatePage';

import requireAuth from './utils/requireAuth';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={DonatePage} />
    <Route path="signup" component={SignupPage} />
    <Route path="login" component={LoginPage} />
  </Route>
)

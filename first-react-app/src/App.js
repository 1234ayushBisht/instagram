import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import { Provider } from 'react-redux';
import store from './store';

import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Navbar from './components/Navbar';
import PrivateRoute from "./components/private-route/PrivateRoute";
import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/Profile";
import Notifications from "./components/Notifications";
import Tag from "./components/Tag"
import LikedPost from "./components/LikedPost"
import Pusher from "./components/Pusher"
import Messages from "./components/Messages"

if (localStorage.jwtToken) {
  const token = localStorage.jwtToken;
  setAuthToken(token);
  const decoded = jwt_decode(token);
  store.dispatch(setCurrentUser(decoded));
 

  const currentTime = Date.now() / 1000; 
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    window.location.href = "./login";
  }
}

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Navbar />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <Switch>
            <PrivateRoute exact path="/" component={Home} />
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <PrivateRoute exact path="/profile/:userId" component={Profile} />
            <PrivateRoute exact path="/tag/:tag_name" component={Tag} />
            <PrivateRoute exact path="/notifications" component={Notifications} />
            <PrivateRoute exact path="/likedPost" component={LikedPost} />
            <PrivateRoute exact path="/messages" component={Messages} />
            <PrivateRoute exact path="/p/:where/:which" component={Pusher} />
          </Switch>
        </Router>
      </Provider>
    )
  }
}

export default App;

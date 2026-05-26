import React, { useState, useContext } from 'react';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom"; 
import './App.css';
import Video from './Video';
import Home from './Home';
import Upload from './Upload';
import ShortUpload from './ShortUpload';
import Signup from './Signup';
import Login from './Login';
import Watch from './Watch';
import ManageChannel from './ManageChannel';
import LikedVideosPage from './Liked';
import SubscriptionsPage from './Subscription';
import Search from './Search';
import UploadProfile from './UploadProfile';
 
function App() {
   
  return (
    <>
    <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/upload" component={Upload} />
      <Route exact path="/likedvideo" component={LikedVideosPage} />
      <Route exact path="/uploadprofile" component={UploadProfile} />
      <Route exact path="/search" component={Search} />
      <Route exact path="/subs" component={SubscriptionsPage} />
      <Route exact path="/channel/:id" component={ManageChannel} />
      <Route exact path="/watch/:id" component={Watch} />
      <Route exact path="/uploadshort" component={ShortUpload} />
      <Route exact path="/signup" component={Signup} />
      <Route exact path="/login" component={Login} />
      
    </Switch>
   </Router>
   </>
  )
}

export default App;

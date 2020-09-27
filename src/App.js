import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {

  const [user,setUser] = useState({
    isSignedIn:false,
    name:'',
    email:'',
    photo:''
  })

  const provider = new firebase.auth.GoogleAuthProvider()

  const handleSignIn = () => {
    console.log('sign in clicked');
    firebase.auth().signInWithPopup(provider)
    .then(res=>{
      const {displayName,email,photoURL} = res.user;
      const signInUser = {
        isSignedIn : true,
        name : displayName,
        email : email,
        photo : photoURL
      }
      setUser(signInUser)
      console.log(displayName,email,photoURL);
    })
    .catch(err =>{
      console.log(err);
      console.log(err.message);
    })
  }
  const handleSignOut = () => {
    const signOutUser = {
      isSignedIn : false,
      name : '',
      email : '',
      photo :''
    };
    setUser(signOutUser);
  }
  return (
    <div className="App">
      { 
        // use short way if else
        user.isSignedIn ? 
        <button onClick={handleSignOut} >Sign out</button>
        :
        <button onClick={handleSignIn} >Sign In</button>
      }
      {
        user.isSignedIn && 
        <div> 
          <p>Welcome {user.name} </p>
          <p>Your email: {user.email} </p>
          <img src={user.photo} alt=""/>
        </div>
      }
    </div>
  );
}

export default App;

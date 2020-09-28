import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    error: '',
    photo: '',
    success: ''
  })

  const provider = new firebase.auth.GoogleAuthProvider()

  const handleSignIn = () => {

    console.log('sign in clicked');
    firebase.auth().signInWithPopup(provider)
      .then(res => {
        const { displayName, email, photoURL } = res.user;
        const signInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(signInUser)
        console.log(displayName, email, photoURL);
      })
      .catch(err => {
        console.log(err);
        console.log(err.message);
      })
  }
  const handleSignOut = () => {
    const signOutUser = {
      isSignedIn: false,
      name: '',
      email: '',
      photo: ''
    };
    setUser(signOutUser);
  }


  const handleBlur = (e) => {
    let isFielValid = true;
    if (e.target.name === 'email') {
      isFielValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if (e.target.name === 'password') {
      const isNumberValid = e.target.value.length > 6;
      const isPasswordValid = /\S{1}/.test(e.target.value)
      isFielValid = isNumberValid && isPasswordValid;
    }
    if (isFielValid) {
      const newUserInfo = { ...user }
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo)
    }
  }


  const handleSubmit = (e) => {
    if (newUser && user.email && user.password) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
          const newUserInfo = { ...user }
          newUserInfo.error = "";
          newUserInfo.success = true;
          setUser(newUserInfo);
          upDataUserInfo(user.name)

        })
        .catch(function (error) {
          const newUserInfo = { ...user }
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }

    if (!newUser && user.email && user.password) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
          const newUserInfo = { ...user }
          newUserInfo.error = "";
          newUserInfo.success = true;
          setUser(newUserInfo);
          console.log ("sign in user info", res.user)

        })
        .catch(function (error) {
          const newUserInfo = { ...user }
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }

    e.preventDefault();
  }


  const upDataUserInfo = (name) => {
    var user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name,
      photoURL: "https://example.com/jane-q-user/profile.jpg"
    }).then(function () {
      console.log('User name updated successfully')
    }).catch(function (error) {
      console.log(error)
    });
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
          <img src={user.photo} alt="" />
        </div>
      }
      <h1>Our Own Ahthentication</h1>
      <p>Name:{user.name} </p>
      <p>Email:{user.email}</p>
      <p>Password:{user.password}</p>
      <input type="checkBox" name="newuser" onChange={() => setNewUser(!newUser)} id="" />
      <label htmlFor="newuser" > New User Sign Up </label>
      <form onSubmit={handleSubmit} >
        {newUser && <input type="name" name="name" onBlur={handleBlur} placeholder="Name" />}<br />
        <input type="email" name="email" onBlur={handleBlur} placeholder="Email" required /><br />
        <input type="password" name="password" onBlur={handleBlur} placeholder="Password" required /><br />
        <input type="submit" value={newUser ? 'Sign up': 'Sign in'} />
      </form>
      <p style={{ color: "red" }}> {user.error} </p>
      {
        user.success && <p style={{ color: "green" }}> User {newUser ? 'create' : 'logged in'} successfully</p>
      }
    </div>
  );
}

export default App;

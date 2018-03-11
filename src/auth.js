// @flow
import * as React from 'react';
import { Link, NavLink, HashRouter, Switch, Route } from 'react-router-dom';
import createHashHistory from 'history/createHashHistory';
const history = createHashHistory();

import { lang, en, no } from './lang';
import { User, Event, userService } from './services';
import { ErrorMessage, errorMessage } from './errorMessage';

import { Menu, menu } from './menu';

class SignIn extends React.Component<{}> {
  refs: {
    signInUsername: HTMLInputElement,
    signInPassword: HTMLInputElement,
    signInButton: HTMLButtonElement,
  }

  hashCode(str: string) {
    let hash = 0;
    if (str.length == 0) return hash;
    for (let i = 0; i < str.length; i++) {
        let char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  render() {
    return (
      <div className="inputForm">
        <input className="form" type='text' ref='signInUsername' placeholder={lang.email} />
          <img className="inputIcon" src="resources/loginUser.svg"></img>
        <input className="form" type='password' ref='signInPassword' placeholder={lang.password} />
          <img className="inputIcon" id="passIcon" src="resources/loginPass.svg"></img>
        <button className="form" id="signInButton" ref='signInButton'>{lang.signIn}</button>
      </div>
    );
  }

  componentDidMount() {
    if(menu) menu.forceUpdate();

    this.refs.signInButton.onclick = () => {
      let hashedPass = this.hashCode(this.refs.signInPassword.value);
      userService.signIn(this.refs.signInUsername.value, hashedPass).then(() => {
        history.push('/');
      }).catch((error: Error) => {
        if(errorMessage) errorMessage.set(lang.errorLogin);
      });
    };
  }
}

class SignOut extends React.Component<{}> {

  render() {
    return (<div></div>);
  }

  componentDidMount() {
    if(menu) menu.forceUpdate();
    let result = confirm(lang.confirmSignOut);
    if (result) {
      localStorage.removeItem('signedInUser');
    }
    history.push('/');
    this.forceUpdate();
  }
}

class SignUp extends React.Component<{}> {
  refs: {
    signUpUsername: HTMLInputElement,
    signUpPassword: HTMLInputElement,
    signUpFirstname: HTMLInputElement,
    signUpLastname: HTMLInputElement,
    signUpButton: HTMLButtonElement
  }

  hashCode(str: string) {
    let hash = 0;
    if (str.length == 0) return hash;
    for (let i = 0; i < str.length; i++) {
        let char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  render() {
    return (
      <div className="inputForm">
        <input className="form" type='text' ref='signUpUsername' placeholder={lang.email} />
          <img className="inputIcon" src="resources/loginUser.svg"></img>
        <input className="form" type='text' ref='signUpPassword' placeholder={lang.password} />
          <img className="inputIcon" id="passIcon" src="resources/loginPass.svg"></img>
        <input className="form" type='text' ref='signUpFirstname' placeholder={lang.firstName} />
        <input className="form" type='text' ref='signUpLastname' placeholder={lang.lastName} />
        <button className="form" id="signUpButton" ref='signUpButton'>{lang.signUp}</button>
      </div>
    );
  }

  componentDidMount() {
    if(menu) menu.forceUpdate();


    this.refs.signUpButton.onclick = () => {
      let hashedPass = this.hashCode(this.refs.signUpPassword.value);
      userService.signUp(this.refs.signUpUsername.value, hashedPass, this.refs.signUpFirstname.value, this.refs.signUpLastname.value).then(() => {
        userService.signIn(this.refs.signUpUsername.value, hashedPass).then(() => {
          history.push('/');
        });
      }).catch((error: Error) => {
        if(errorMessage) errorMessage.set("Error");
      });
    };
  }
}

export { SignIn, SignOut, SignUp };

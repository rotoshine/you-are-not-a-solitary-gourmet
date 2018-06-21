import React, { Component } from 'react';
import UserContext from './context/UserContext'
import GoogleLoginButton from './GoogleLoginButton'
import logo from './logo.svg';
import FBTest from './FBTest'
import './App.css';

import { findTodayParties } from './utils/partyUtils'

const { firebase } = window

class App extends Component {
  state = {
    user: null,
    parties: []
  }

  async componentDidMount() {    
    await firebase.auth().getRedirectResult()
    await this.loadCurrentUser()

    const parties = await findTodayParties()

    console.log(parties)
    this.setState({
      parties: parties
    })
  }

  async loadCurrentUser() {    
    const { currentUser } = firebase.auth() 
    if (currentUser !== null) {
      const { displayName, email, photoURL } = currentUser
      this.setState({
        user: {
          email,
          displayName,
          photoURL
        }
      })
    }
  }

  handleSignOut = async () => {
    await firebase.auth().signOut()
  }

  render() {
    const { user } = this.state

    return (
      <UserContext.Provider value={user}>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
          { user === null && <GoogleLoginButton /> }
          { user !== null && <button onClick={this.handleSignOut}>Logout</button> }
        </div>
        <FBTest />
        {this.state.parties.map(party => JSON.stringify(party))}
      </UserContext.Provider>
    );
  }
}

export default App;

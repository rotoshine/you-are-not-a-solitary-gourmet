import React, { Component } from 'react'
import UserContext from './context/UserContext'
import GoogleLoginButton from './GoogleLoginButton'
import FBTest from './FBTest'

import { findTodayParties  } from './utils/partyUtils'
import { findCommentsByPartyId } from './utils/commentUtils'
import CommentTestForm from './CommentTestForm';

import './App.css';
import { addUserIfNotExist } from './utils/userUtils';
import PartyList from './PartyList'

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

    parties.forEach(async (party) => {
      console.log(await findCommentsByPartyId(party.id))
    })
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
      addUserIfNotExist({
        email,
        displayName,
        photoURL
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
            <h1 className="App-title">you are not a solitary gourmet</h1>
            <p className="App-intro">
              오늘도 혼자인가요? <em>안 고독한 미식가</em>와 함께 더 이상 혼자 먹지 마세요.
            </p>
            <span className="arrow"></span>
            { user === null && <GoogleLoginButton /> }
            { user !== null && <button className="signIn" onClick={this.handleSignOut}>Logout</button> }
          </header>
          <PartyList
            parties={this.state.parties}
          />
        </div>
        {/* <FBTest /> */}
        <UserContext.Consumer>
          {user => (
            <CommentTestForm user={user}/>
          )}
        </UserContext.Consumer>
        {/* {this.state.parties.map(party => JSON.stringify(party))} */}
      </UserContext.Provider>
    )
  }
}

export default App

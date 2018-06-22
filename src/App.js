import React, { Component, Fragment } from 'react'
import UserContext from './context/UserContext'
import GoogleLoginButton from './GoogleLoginButton'
import FBTest from './FBTest'

import { findTodayParties, joinParty } from './utils/partyUtils'
import CommentTestForm from './CommentTestForm';

import './App.css';
import { addUserIfNotExist, findByEmail } from './utils/userUtils';
import PartyList from './PartyList'

const { firebase } = window

class App extends Component {
  state = {
    user: null,
    nowPartiesLoading: false,
    parties: []
  }

  async componentDidMount() {
    await firebase.auth().getRedirectResult()
    await this.loadCurrentUser()

    await this.fetchParties()
  }

  async asyncSetState(state) {
    return new Promise((resolve) => this.setState(state, resolve))
  }

  async fetchParties() {
    await this.asyncSetState({ nowPartiesLoading: true })
    const parties = await findTodayParties()
    await this.asyncSetState({
      parties,
      nowPartiesLoading: false
    })
  }

  async loadCurrentUser() {
    const { currentUser } = firebase.auth()
    if (currentUser !== null) {
      const { displayName, email, photoURL } = currentUser

      await addUserIfNotExist({
        email,
        displayName,
        photoURL
      })

      const user = await findByEmail(email)

      console.log('user', user)

      this.setState({
        user: {
          id: user.id,
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

  handleJoinPartyClick = async (partyId, userId) => {
    await joinParty(partyId, userId)
    await this.fetchParties()
  }

  render() {
    const { user, nowPartiesLoading } = this.state

    return (
      <UserContext.Provider value={user}>
        <UserContext.Consumer>
          {user => (
            <Fragment>
              <div className="App">
                <header className="App-header">
                  <h1 className="App-title">you are not a solitary gourmet</h1>
                  <p className="App-intro">
                    오늘도 혼자인가요? <em>안 고독한 미식가</em>와 함께 더 이상 혼자 먹지 마세요.
                </p>
                  <span className="arrow"></span>
                  {user === null && <GoogleLoginButton />}
                  {user !== null && <button className="signIn" onClick={this.handleSignOut}>Logout</button>}
                </header>
                <div className="App__contents">
                  {nowPartiesLoading ?
                    <span>Loading..</span> :
                    <PartyList
                      user={user}
                      parties={this.state.parties}
                      onJoinParty={this.handleJoinPartyClick}
                    />
                  }
                </div>
              </div>
              {/* <FBTest /> */}
              {/* <CommentTestForm user={user} /> */}
            </Fragment>
          )}
        </UserContext.Consumer>
        {/* {this.state.parties.map(party => JSON.stringify(party))} */}
      </UserContext.Provider>
    )
  }
}

export default App

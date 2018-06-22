import React, { Component } from 'react'
import * as firebase from 'firebase';

import PartyList from './PartyList'
import GoogleLoginButton from './GoogleLoginButton'

import { findTodayParties, addParty, joinParty, leaveParty } from './utils/partyUtils'
import { addUserIfNotExist } from './utils/userUtils';

import './App.css';

require('dotenv').config()

const {
  REACT_APP_FIREBASE_API_KEY,
  REACT_APP_FIREBASE_AUTH_DOMAIN,
  REACT_APP_FIREBASE_DATABASE_URL,
  REACT_APP_FIREBASE_PROJECT_ID
} = process.env

firebase.initializeApp({
  apiKey: REACT_APP_FIREBASE_API_KEY,
  authDomain: REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: REACT_APP_FIREBASE_DATABASE_URL,
  projectId: REACT_APP_FIREBASE_PROJECT_ID
})

window.firebase = firebase

class App extends Component {
  state = {
    initialize: false,
    user: null,
    nowPartiesLoading: false,
    parties: null
  }

  async componentDidMount() {
    await firebase.auth().getRedirectResult()
    await this.loadCurrentUser()

    await this.fetchParties()

    this.setState({
      initialize: true
    })
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
    this.setState({
      user: null
    })
  }

  handleMakeParty = async(party) => {
    const { user } = this.state

    party.joinners = [
      user.email
    ]

    await addParty(party)
    await this.fetchParties()
  }

  handleJoinPartyClick = async (partyId, email) => {
    await joinParty(partyId, email)
    await this.fetchParties()
  }

  handleLeavePartyClick = async (partyId, email) => {
    await leaveParty(partyId, email)
    await this.fetchParties()
  }

  render() {
    const { initialize, nowPartiesLoading, user, parties } = this.state

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">you are not a solitary gourmet</h1>
          <p className="App-intro">
            오늘도 혼자인가요? <em>안 고독한 미식가</em>와 함께 더 이상 혼자 먹지 마세요.
        </p>
          <span className="arrow"></span>
          {user === null && <GoogleLoginButton />}
          {user !== null && (
            <div>
              Hello! {user.displayName}
              <button className="signIn" onClick={this.handleSignOut}>Logout</button>
            </div>
          )}
        </header>
        <div className="App__contents">
          {(!initialize || nowPartiesLoading) && <span>Loading..</span>}
          {parties && (
            <PartyList
              user={user}
              parties={parties}
              onMakeParty={this.handleMakeParty}
              onJoinParty={this.handleJoinPartyClick}
              onLeaveParty={this.handleLeavePartyClick}
            />
          )}
        </div>
      </div>
    )
  }
}

export default App

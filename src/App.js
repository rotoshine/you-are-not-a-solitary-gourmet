import React, { Component } from 'react'

import PartyList from './PartyList'
import GoogleLoginButton from './GoogleLoginButton'

import firebase from './utils/firebase'
import { subscribeTodayParties, unsubscribeTodayParties, addParty, joinParty, leaveParty } from './utils/partyUtils'
import { loadCurrentUser } from './utils/userUtils';

import './App.css';


class App extends Component {
  state = {
    initialize: false,
    user: null,
    userInitialized: false,
    nowPartiesLoading: false,
    parties: null
  }

  componentDidMount() {
    this.initializeUser()
    this.initializeParties()
  }

  componentWillUnmount() {
    unsubscribeTodayParties()
  }

  async asyncSetState(state) {
    return new Promise((resolve) => this.setState(state, resolve))
  }

  async initializeUser() {
    const user = await loadCurrentUser()

    await this.asyncSetState({
      userInitialized: true,
      user
    })
  }

  async initializeParties() {
    subscribeTodayParties((parties) => {
      this.setState({
        parties
      })
    })

    await this.asyncSetState({
      initialize: true
    })
  }

  handleSignOut = async () => {
    await firebase.auth().signOut()
    this.setState({
      user: null
    })
  }

  handleMakeParty = async (party) => {
    const { user } = this.state

    party.joinners = [
      user.email
    ]

    await addParty(party, user)
  }

  handleJoinPartyClick = async (partyId, email) => {
    await joinParty(partyId, email)
  }

  handleLeavePartyClick = async (partyId, email) => {
    await leaveParty(partyId, email)
  }

  render() {
    const { initialize, userInitialized, nowPartiesLoading, user, parties } = this.state

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">you are not a solitary gourmet</h1>
          <p className="App-intro">
            오늘도 혼자인가요? <em>안 고독한 미식가</em>와 함께 더 이상 혼자 먹지 마세요.
        </p>
          <span className="arrow"></span>
          {!userInitialized && 'Loading...'}
          {userInitialized && user === null && <GoogleLoginButton />}
          {userInitialized && user !== null && (
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

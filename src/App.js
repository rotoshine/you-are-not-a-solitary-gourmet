import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

import PartyList from './PartyList'
import GoogleLoginButton from './GoogleLoginButton'

import firebase from './utils/firebase'
import { subscribeTodayParties, unsubscribeTodayParties, addParty, joinParty, leaveParty } from './utils/partyUtils'
import { loadCurrentUser } from './utils/userUtils';

import './App.css';

@inject('partyStore')
@observer
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
    this.props.partyStore.initializeParties()

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
    const { initialize, userInitialized, nowPartiesLoading, user } = this.state
    const { parties } = this.props.partyStore

    return (
      <div className="App">
        <header className="App-header">
          <nav className="App-nav">
            <div className="App-intro">
              <div className="App-container container">
                <h2 className="jumbotron-heading">안 고독한 미식가</h2>
                  {!userInitialized && 'Loading...'}
                  {userInitialized && user === null && (
                  <div>
                    <p className="lead">그대여 오늘도 혼자인가요? 안 고독한 미식가와 함께 더 이상 혼자 먹지 마세요.</p>
                    <GoogleLoginButton />
                  </div>
                  )}
                  {userInitialized && user !== null && (
                    <div>
                      <p className="lead">{user.displayName}, 오늘도 혼자인가요? 안 고독한 미식가와 함께 더 이상 혼자 먹지 마세요.</p>
                      <form className="form-inline my-2 my-lg-0">
                        <button className="btn btn-success my-2" onClick={this.handleSignOut}>Logout</button>
                      </form>
                    </div>
                  )}
              </div>
            </div>
          </nav>
        </header>
        <main>
          <div className="App__contents album py-5 bg-light">
            <div className="container">
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
        </main> 
      </div>
    )
  }
}

export default App

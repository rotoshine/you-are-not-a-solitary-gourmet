import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

import PartyList from './PartyList'
import AuthenticateHeader from './AuthenticateHeader'

import firebase from './utils/firebase'
import { unsubscribeTodayParties, addParty, joinParty, leaveParty } from './utils/partyUtils'
import { loadCurrentUser } from './utils/userUtils';

import './App.css';

@inject('partyStore', 'userStore')
@observer
class App extends Component {
  state = {
    initialize: false,
    userInitialized: false,
    nowPartiesLoading: false,
    parties: null
  }

  componentDidMount() {
    this.initializeParties()
  }

  componentWillUnmount() {
    unsubscribeTodayParties()
  }

  async asyncSetState(state) {
    return new Promise((resolve) => this.setState(state, resolve))
  }

  async initializeParties() {
    this.setState({
      nowPartiesLoading: true,
    })

    this.props.partyStore.initializeParties()

    await this.asyncSetState({
      initialize: true,
      nowPartiesLoading: false,
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
    const { initialize, userInitialized, nowPartiesLoading } = this.state
    const { parties } = this.props.partyStore
    const { user } = this.props.userStore

    return (
      <div className="App">
        <header className="App-header">
          <nav className="App-nav">
            <div className="App-intro">
              <div className="App-container container">
                <AuthenticateHeader />
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

import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

import PartyList from './PartyList'
import GoogleLoginButton from './GoogleLoginButton'

import firebase from './utils/firebase'
import { unsubscribeTodayParties, addParty, joinParty, leaveParty } from './utils/partyUtils'
import { loadCurrentUser } from './utils/userUtils';

import MakeParty from './MakeParty'

import './App.css';

const CATEGORIES = [
  { name: '점심', emoji: '🌮', color: '#FFB16B'},
  { name: '저녁', emoji: '🥘', color: '#FA6BFF' },
  { name: '간식', emoji: '☕️', color: '#FF6C72' },
  { name: '문화생활', emoji: '🍿', color: '#525FFF' },
  { name: '기타', emoji: '🎉', color: '#66BB66' },
]

@inject('partyStore')
@observer
class App extends Component {
  state = {
    initialize: false,
    user: null,
    userInitialized: false,
    nowPartiesLoading: false,
    parties: null,
    isOpen: false,
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

  handleClick = () => {
    const { user } = this.state

    if (!user) {
      alert('로그인이 필요합니다!')
    } else {
      this.setState({ isOpen: true })
    }
  }

  handleClose = () => {
    this.setState({ isOpen: false })
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
          <nav className="App-nav">
            <ul className="nav container">
              <li className="nav__title nav-item">
                <a className="nav-link" href="#">안 고독한 미식가</a>
              </li>
              <li className="nav__login nav-item">
                <GoogleLoginButton />
              </li>
            </ul>
          </nav>
        <div className="App-intro">
          <div className="App__container container">
              {!userInitialized && 'Loading...'}
              {userInitialized && user === null && (
              <div>
                <h2 className="App__container-header">오늘도 혼자인가요? <br />더이상 혼자 먹지 마세요.</h2>
                <p className="lead">파티에 참여해 보세요. 원하는 파티가 없다면 직접 만드는건 어떤가요?</p>
                <button
                  className="App__button btn btn-big"
                  onClick={this.handleClick}
                >
                  파티 만들기
                </button>
              </div>
              )}
              {userInitialized && user !== null && (
                <div>
                <h2 className="App__container-header">{user.displayName} 🍔<br />오늘도 혼자인가요? <br />더이상 혼자 먹지 마세요.</h2>
                <p className="lead">파티에 참여해 보세요. 원하는 파티가 없다면 직접 만드는건 어떤가요?</p>
                <button
                  className="App__button btn btn-outline-dark"
                  onClick={this.handleClick}
                >
                  파티 만들기
                </button>
                </div>
              )}
          </div>
        </div>
        <main className="container">
          {
            this.state.isOpen && <MakeParty onClose={this.handleClose} onMakeParty={this.handleMakeParty} />
          }
          <div className="App__contents album py-5">
            <h3 className="App__contents-title">어떤파티를 찾나요? 🎉</h3>
            <ul className="App__categories">
              {CATEGORIES.map( item =>  (
                  <li
                    key={item.name}
                    style={{ backgroundColor: item.color }}
                    className="App__category">
                    <p className="category-emoji">{item.emoji}</p>
                    <p className="category-title">{item.name}</p>
                  </li>
                ))
              }
            </ul>
          </div>
          <div className="App__contents album py-5">
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
        </main> 
      </div>
    )
  }
}

export default App

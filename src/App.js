import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'

import PartyList from './PartyList'
import AuthenticateHeader from './AuthenticateHeader'

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
@inject('partyStore', 'userStore')
@observer
class App extends Component {
  state = {
    initialize: false,
    userInitialized: false,
    nowPartiesLoading: false,
    parties: null,
    isOpen: false,
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
      user: null,
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
    const {
      initialize,
      userInitialized,
      nowPartiesLoading,
      isOpen
    } = this.state

    const { parties } = this.props.partyStore
    const { user } = this.props.userStore

    return (
      <div className="App">
        <AuthenticateHeader />
        {!userInitialized && (
        <div className="App__constraint">
          <div className="App__intro">
            <div className="App__container container">
              <h2 className="App__container-header">'안 고독한 미식가🔥'</h2>
              <p className="App__text">안고미 클라우드에서 데이터를 긁어오는중 삐리리~</p>
            </div>
          </div>
        </div>
        )}
        {userInitialized && user === null && (
        <div className="App__constraint">
            <div className="App__header">
              <GoogleLoginButton />
            </div>
          <div className="App__intro">
            <div className="App__container container">
              <small>안 고독한 미식가</small>
              <h2 className="App__container-header">오늘도 혼자인가요?</h2>
              <h2 className="App__container-header">더이상 혼자 먹지 마세요.</h2>
              <p className="App__text">다양한 파티에 참여해보세요. 로그인 후 이용할 수 있습니다.</p>
            </div>
          </div>
        </div>
        )}
        {userInitialized && user !== null && (
          <div className="App">
            {isOpen && (
              <MakeParty 
                onMakeParty={this.handleMakeParty}
                onClose={this.handleClose}
              />
            )}
            
            <div className="App__header">
              <button
                  className="App__button"
                  onClick={this.handleClick}
                >
                  파티만들기
              </button>
              <button
                  className="App__button"
                  onClick={this.handleSignOut}
                >
                  로그아웃
              </button>
            </div>
          <div className="App__intro App__intro-member">
            <div className="App__container container">
              <small>안 고독한 미식가</small>
              <h2 className="App__container-header">오늘도 혼자인가요?</h2>
              <h2 className="App__container-header">더이상 혼자 먹지 마세요.</h2>
              <p className="App__text">원하는 파티가 없다구요? 직업 파티를 만들어보세요.</p>
            </div>
          </div>
          <div className="App__contents container album py-5">
            <h3 className="App__text-black">어떤파티를 찾나요? 🎉</h3>
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
          <div className="App__contents container album py-5">
            <div>
            <h3 className="App__text-black">다가오는 파티 👀</h3>
            </div>
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
        )}
        </div>
    )
  }
}

export default App

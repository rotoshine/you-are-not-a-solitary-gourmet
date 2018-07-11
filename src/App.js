import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'

import PartyList from './PartyList'
import MakeParty from './MakeParty'
import AuthenticateHeader from './AuthenticateHeader'

import { unsubscribeTodayParties, addParty, joinParty, leaveParty } from './utils/partyUtils'

import './App.css';

const CATEGORIES = [
  { name: '점심', emoji: '🌮', color: '#FFB16B'},
  { name: '저녁', emoji: '🥘', color: '#FA6BFF' },
  { name: '간식', emoji: '☕️', color: '#FF6C72' },
  { name: '문화생활', emoji: '🍿', color: '#525FFF' },
  { name: '기타', emoji: '🎉', color: '#66BB66' },
]

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
      initialize: true,
      nowPartiesLoading: false,
    })
  }

  handleClick = () => {
    const { user } = this.props.userStore

    if (!user) {
      alert('로그인이 필요합니다!')
    } else {
      this.setState({ isOpen: true })
    }
  }

  handleClose = () => {
    this.setState({ isOpen: false })
  }

  handleMakeParty = async (party) => {
    const { user } = this.props.userStore

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
    const { isOpen } = this.state
    const { parties } = this.props.partyStore
    const { user } = this.props.userStore

    return (
      <div className="App">
        <AuthenticateHeader/>
        {user && (
          <Fragment>
            <button
              className="App__button make"
              onClick={this.handleClick}
            >
              파티만들기
            </button>
          {isOpen && (
            <MakeParty 
              onMakeParty={this.handleMakeParty}
              onClose={this.handleClose}
            />
          )}
          <div className="App__contents container album py-5">
            <h3 className="App__text-black">어떤파티를 찾나요? <span role="img" aria-label="tada">🎉</span></h3>
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
            <h3 className="App__text-black">다가오는 파티 <span role="img" aria-label="eyes">👀</span></h3>
            </div>
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
          </Fragment>
        )}
        </div>
    )
  }
}

export default App

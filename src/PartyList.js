import React, { Component } from 'react'
import moment from 'moment'

import GoogleLoginButton from './GoogleLoginButton'
import DueCountDown from './DueCountDown'

import MakeParty  from './MakeParty'

import './PartyList.css'

class PartyList extends Component {
  state = {
    isOpen: false
  }
  handleJoinPartyClick = (party) => {
    const { user, onJoinParty } = this.props

    if (user) {
      onJoinParty(party.id, user.email)
    }
  }
  handleClick = () => {
    this.setState({ isOpen: true })
  }

  handleClose = () => {
    this.setState({ isOpen: false })
  }
  render() {
    const { user, parties } = this.props

    return (
      <div className="PartyList">
        <h3>오늘의 파티를 찾아보세요!</h3>
        <button
          onClick={this.handleClick}
        >
        파티만들기
        </button>
        {
          this.state.isOpen && <MakeParty handleClose={this.handleClose} />
        }
        <ul className="PartyList__parties">
          {parties.map(party => (
            <li key={party.id} className="PartyList__party">
              <div className="PartyList__partyContent">
                <h3>[{party.category}] {party.title}</h3>
                <p>{party.description}</p>
                <p>
                  <span className="PartyList__label">먹으러 갈 곳</span>
                  <span>{party.destinationName}</span>
                </p>
                <p>
                  <span className="PartyList__label">모집 마감 시간</span>
                  <span>{moment(party.dueDateTime).format('YYYY.MM.DD HH:mm')}</span>
                </p>
                {party.maxPartyMember > 0 ? (
                  <p>
                    <span className="PartyList__label">모집 멤버수</span>
                    <span>{party.maxPartyMember} 중 {party.joinners.length} 명이 모였습니다.</span>
                  </p>
                ) : (
                    <span>멤버 모집 제한이 없습니다.</span>
                  )
                }
                <p><DueCountDown dueDateTime={party.dueDateTime} /></p>
                <div className="PartyList__joinners">
                  <span className="PartyList__label PartyList__label--partyMembers">파티원</span>
                  <div className="PartyList__joinnersPhoto">
                    {party.joinners.map((joinner) => (
                      <img src={joinner.photoURL} alt={joinner.displayName} />
                    ))}
                  </div>
                </div>
                <div className="PartyList__partyButtons">
                  {
                    user ? (
                      <button onClick={() => this.handleJoinPartyClick(party)}>파티합류!</button>
                    ) : (
                        <GoogleLoginButton />
                      )
                  }
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export default PartyList
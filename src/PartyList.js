import React, { Component } from 'react'
import moment from 'moment'

import GoogleLoginButton from './GoogleLoginButton'
import DueCountDown from './DueCountDown'

import MakeParty from './MakeParty'

import './PartyList.css'

class PartyList extends Component {
  state = {
    isOpen: false
  }

  alreadyJoin(party) {
    const { user } = this.props    
    return party.joinners.find((joinner) => joinner.email === user.email)
  }

  alreadyDeadline = (party) => {
    return new Date(party.dueDateTime).getTime() < new Date().getTime()
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

  renderPartyJoinButton(party) {
    const { user, onLeaveParty } = this.props

    if (!user) {
      return <GoogleLoginButton />
    } else {
      if (this.alreadyJoin(party)) {
        return (
          <button type="button"
            onClick={() => onLeaveParty(party.id, user.email)}>참여 취소하기</button>
        )
      } else if (!this.alreadyJoin(party) && this.alreadyDeadline(party)) {
        return <span>저런! 파티 마감시간이 지났네요 :( </span>
      }

      return (<button onClick={() => this.handleJoinPartyClick(party)}>파티합류!</button>)
    }
  }

  render() {
    const { parties, onMakeParty } = this.props

    return (
      <div className="PartyList">
        <h3>오늘의 파티를 찾아보세요!</h3>
        <button
          onClick={this.handleClick}
        >
          파티만들기
        </button>
        {
          this.state.isOpen && <MakeParty onClose={this.handleClose} onMakeParty={onMakeParty}/>
        }
        <ul className="PartyList__parties">
          {parties.length === 0 && <h4>저런! 아무런 파티가 없군요. 파티를 직접 만들어보시는 건 어떨까요?</h4>}
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
                    <span><strong>{party.maxPartyMember}</strong> 명 중 <strong>{party.joinners.length}</strong> 명이 모였습니다.</span>
                  </p>
                ) : (
                    <span>멤버 모집 제한이 없습니다.</span>
                  )
                }
                <DueCountDown dueDateTime={party.dueDateTime} />                
                <div className="PartyList__joinners">
                  <span className="PartyList__label PartyList__label--partyMembers">파티원</span>
                  <div className="PartyList__joinnersPhoto">
                    {party.joinners.map((joinner, i) => (
                      <img key={i} src={joinner.photoURL} alt={joinner.displayName} />
                    ))}
                  </div>
                </div>
                <div className="PartyList__partyButtons">
                  {this.renderPartyJoinButton(party)}
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
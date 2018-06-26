import React, { Component } from 'react'
import moment from 'moment'

import GoogleLoginButton from './GoogleLoginButton'
import DueCountDown from './DueCountDown'

import MakeParty from './MakeParty'
import PartyComments from './PartyComments'

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
    const { user } = this.props

    if (!user) {
      alert('로그인이 필요합니다!')
    } else {
      this.setState({ isOpen: true })
    }
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
            className="btn btn-outline-success"
            onClick={() => onLeaveParty(party.id, user.email)}>참여 취소하기</button>
        )
      } else if (!this.alreadyJoin(party) && this.alreadyDeadline(party)) {
        return <span>저런! 파티 마감시간이 지났네요 :( </span>
      }

      return (<button className="btn btn-outline-success" onClick={() => this.handleJoinPartyClick(party)}>파티합류!</button>)
    }
  }

  renderMemberLimit(party) {
    const { maxPartyMember, joinners } = party
    if (maxPartyMember === 0) {
      return <p><span>멤버 모집 제한이 없습니다.</span></p>
    } else {
      const joinnedMemberCount = joinners.length

      if (maxPartyMember > joinnedMemberCount) {
        return (
          <p>
            <span className="PartyList__label">모집 멤버수</span>
            <span><strong>{party.maxPartyMember}</strong> 명 중 <strong>{party.joinners.length}</strong> 명이 모였습니다.</span>
          </p>
        )
      } else if (maxPartyMember === joinnedMemberCount) {
        return <span>파티 멤버 {joinners.length} 명 모집이 완료되었습니다.</span>
      }
    }
  }

  render() {
    const { user, parties, onMakeParty } = this.props

    return (
      <div className="PartyList">
        <div className="PartyList-header">
          <h3>오늘의 파티를 찾아보세요!</h3>
          <button
            className="btn btn-outline-success"
            onClick={this.handleClick}
          >
            파티만들기
          </button>
        </div>
        {
          this.state.isOpen && <MakeParty onClose={this.handleClose} onMakeParty={onMakeParty} />
        }
        <div className="PartyList__parties row">
          {parties.length === 0 && <h4>저런! 아무런 파티가 없군요. 파티를 직접 만들어보시는 건 어떨까요?</h4>}
          {parties.map(party => (
            <div key={party.id} className="PartyList__party card border-light col-md-6 col-lg-4">
              <div className="PartyList__partyContent card-body">
                <h5 className="card-title">[{party.category}] {party.title}</h5>
                <div className="card-text">
                  <p className="PartyList__desc">{party.description}</p>
                  <div className="PartyList__info">
                    <p>
                      <span className="PartyList__label">먹으러 갈 곳: </span>
                      <span>{party.destinationName}</span>
                    </p>
                    <p>
                      <span className="PartyList__label">모집 마감 시간: </span>
                      <span>{moment(party.dueDateTime.toDate()).format('YYYY.MM.DD HH:mm')}</span>
                    </p>
                    {this.renderMemberLimit(party)}
                    <DueCountDown dueDateTime={party.dueDateTime.toDate()} />
                  </div>
                </div>
                <div className="PartyList__joinners">
                  <span className="PartyList__label PartyList__label--partyMembers">파티원: </span>
                  <div className="PartyList__joinnersPhoto">
                    {party.joinners && party.joinners.map((joinner, i) => (
                      <img key={i} src={joinner.photoURL} alt={joinner.displayName} />
                    ))}
                  </div>
                </div>
                <div className="PartyList__partyButtons">
                  {this.renderPartyJoinButton(party)}
                </div>                
              <PartyComments user={user} partyId={party.id} />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default PartyList
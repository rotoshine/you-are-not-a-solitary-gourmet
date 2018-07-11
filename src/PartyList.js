import React, { Component } from 'react'
import moment from 'moment'
import { find } from 'lodash'

import DueCountDown from './DueCountDown'
import PartyDetail from './PartyDetail'

import './PartyList.css'

class PartyList extends Component {
  state = {
    isOpen: false,
    partyId: '',
  }

  handleClick = (partyId) => {
    this.setState({ isOpen: true, partyId })
  }

  handleClose = (e) => {
    this.setState({ isOpen: false })
  }

  alreadyJoin(party) {
    const { user } = this.props
    return party.joinners.find((joinner) => joinner.email === user.email)
  }

  alreadyDeadline = (party) => {
    return party.dueDateTime.toDate() < new Date()
  }

  handleJoinPartyClick = (party) => {
    const { user, onJoinParty } = this.props

    if (user) {
      onJoinParty(party.id, user.email)
    }
  }

  renderPartyJoinButton = (party) => {
    const { user, onLeaveParty } = this.props

    if (this.alreadyJoin(party)) {
      return (
        <button type="button"
          className="PartyDetail__button"
          onClick={() => onLeaveParty(party.id, user.email)}>참여 취소하기</button>
      )
    } else if (this.alreadyDeadline(party)) {
      return <span>저런! 파티 마감시간이 지났네요 :( </span>
    }  
    return (<button className="PartyDetail__button" onClick={() => this.handleJoinPartyClick(party)}>파티합류!</button>)
  }

  renderMemberLimit(party) {
    const { maxPartyMember, joinners } = party
    if (maxPartyMember === 0) {
      return <span>무제한 멤버</span>
    } else {
      const joinnedMemberCount = joinners.length

      if (maxPartyMember > joinnedMemberCount) {
        return (
          <span>총 {party.maxPartyMember}명</span>
        )
      } else if (maxPartyMember === joinnedMemberCount) {
        return <span>인원마감</span>
      }
    }
  }

  render() {
    const { user, parties } = this.props
    const { isOpen, partyId } = this.state
  
    return (
      <div className="PartyList">
        {isOpen && (
          <PartyDetail 
            party={find(parties, {'id': partyId })}
            renderMemberLimit={this.renderMemberLimit}
            renderPartyJoinButton={this.renderPartyJoinButton}
            user={user}
            handleClose={this.handleClose}
          />
        )}
        <div className="PartyList__parties">
          {parties.length === 0 && <h4 className="App__text-black">저런! 아무런 파티가 없군요. 파티를 직접 만들어보시는 건 어떨까요?</h4>}
          {parties.map(party => (
            <div 
              key={party.id}
              className="PartyList__party"
              onClick={() => this.handleClick(party.id)}
            >
              <div className="PartyList__partyContent">
                <div className="PartyList__tags">
                  {party.category && (
                    <span className="PartyList__tag">{party.category}</span>
                  )}
                  <span className="PartyList__tag">{this.renderMemberLimit(party)}</span>
                </div>
                <div className="card-text">
                  <h2 className="PartyList__partyTitle">{party.title}</h2>
                  <div className="PartyList__info">
                    <div className="PartyList__block">
                      <p className="PartyList__info-text">{party.destinationName}</p>
                      <p className="PartyList__info-text">
                        <span>{moment(party.partyTime.toDate()).format('YYYY.MM.DD HH:mm')}</span>
                        <DueCountDown dueDateTime={party.dueDateTime.toDate()} />
                      </p>
                    </div>
                    <div className="PartyList__joinners">
                      <div className="PartyList__joinnersPhoto">
                        {party.joinners && party.joinners.map((joinner, i) => (
                          <span className="PartyList__joinnerGroup tooltip-joinner" key={i}>
                            <img src={joinner.photoURL} alt={joinner.displayName} />
                            <span className="tooltiptext-joinner">{joinner.displayName}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>  
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default PartyList
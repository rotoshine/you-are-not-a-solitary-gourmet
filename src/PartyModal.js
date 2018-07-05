import React, { Component } from 'react'
import moment from 'moment'

import DueCountDown from './DueCountDown'

import MakeParty from './MakeParty'
import PartyComments from './PartyComments'

import './PartyModal.css'

class PartyModal extends Component {
  
  render() {
    const { party } = this.props
    return (
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
    )
  }
}
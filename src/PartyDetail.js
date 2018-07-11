import React, { Component } from 'react'
import moment from 'moment'

import DueCountDown from './DueCountDown'
import PartyComments from './PartyComments'

import './PartyList.css'

class PartyDetail extends Component {

  render() {
    const { party, renderMemberLimit, renderPartyJoinButton, user, handleClose } = this.props
    
    return (
      <div className="PartyDetail-overlay">
        <div className="PartyDetail-group">
            <div className="PartyDetail__partyContent">
              <div className="PartyList__tags">
                <span className="PartyList__tag">{party.category}</span>
                <span className="PartyList__tag">{renderMemberLimit(party)}</span>
                <button
                  className="btn btn-sm btn-light onclick"
                  onClick={handleClose}
                >닫기</button>
              </div>
              <div className="card-text">
                <h2 className="PartyList__partyTitle">{party.title}</h2>
                <div className="PartyList__partyButtons">
                  {renderPartyJoinButton(party)}
                </div>
                <DueCountDown dueDateTime={party.dueDateTime.toDate()} />  
                <div className="PartyDetail__info">
                  <div className="PartyDetail__block">
                    <h5>파티 상세 정보</h5>
                    <p className="PartyList__info-text">
                      <span>장소 | </span>
                      <span>{party.destinationName}</span>
                    </p>
                    <p className="PartyList__info-text">
                      <span>일시 | </span>
                      <span>{moment(party.partyTime.toDate()).format('YYYY.MM.DD HH:mm')}</span>
                    </p>
                    <p className="PartyList__info-text">
                      <span><strong>{party.maxPartyMember}</strong> 명 중 <strong>{party.joinners.length}</strong> 명이 모였습니다.</span>
                    </p>
                  </div>
                  <div className="PartyDetail__block">
                  <h5>파티 설명</h5>
                  <p className="PartyList__info-text">
                    <span>{party.description}</span>
                  </p>
                  </div>
                  <div className="PartyDetail__block">
                    <h5>누가 오나요?</h5>
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
                <PartyComments user={user} partyId={party.id} />
              </div>
            </div>
        </div>
      </div>
    )
  }
}

export default PartyDetail
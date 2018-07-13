import React, { Component } from 'react'
import moment from 'moment'
import styled from 'styled-components'
import { find } from 'lodash'

import DueCountDown from './DueCountDown'
import PartyDetail from './PartyDetail'

import { PartyTitle, PartyItemInfoText } from './PartyStyledComponents'

const PartyTag = styled.span`
  width: 60px;
  background: orange;
  padding: 6px 10px;
  margin-right: 10px;
  line-height: 26px;
  font-size: 1.4rem;
  border-radius: 2px;
`

const PartyItem = styled.div`
  margin: 3rem 0;
  border-radius: 6px;
  min-height: 200px;
  box-shadow: 0px 4px 16px 2px #6666663b;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(0.98);
    box-shadow: 0px 4px 16px 2px #6666663b;
  }
`

const PartyItemInfo = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`

const PartyItemContents = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2.6rem;
  flex: 1 1 auto;
`

const PartyJoinners = styled.div`
  margin: 0.6rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const PartyJoinnerPhoto = styled.div`
  display: flex;

  img {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    border: 1px solid #ccc;
    margin-right: 10px;
  }
`

const PartyJoinnerGroup = styled.span`
  width: 100%;
  height: 100%;
`

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
    const { user, parties, onLeaveParty } = this.props
    const { isOpen, partyId } = this.state

    return (
      <div className="PartyList">
        {isOpen && (
          <PartyDetail
            party={find(parties, { 'id': partyId })}
            renderMemberLimit={this.renderMemberLimit}
            renderPartyJoinButton={this.renderPartyJoinButton}
            user={user}
            handleClose={this.handleClose}
            onJoinParty={this.handleJoinPartyClick}
            onLeaveParty={onLeaveParty}
          />
        )}
        {parties && parties.length === 0 && <h4 className="App__text-black">저런! 아무런 파티가 없군요. 파티를 직접 만들어보시는 건 어떨까요?</h4>}
        {parties.map(party => (
          <PartyItem
            key={party.id}
            className="PartyList__party"
            onClick={() => this.handleClick(party.id)}
          >
            <PartyItemContents>
              <div>
                {party.category && (
                  <PartyTag>{party.category}</PartyTag>
                )}
                <PartyTag>{this.renderMemberLimit(party)}</PartyTag>
              </div>
              <div className="card-text">
                <PartyTitle>{party.title}</PartyTitle>
                <PartyItemInfo>
                  <div className="PartyList__block">
                    <PartyItemInfoText>{party.destinationName}</PartyItemInfoText>
                    <PartyItemInfoText>
                      <span>{moment(party.partyTime.toDate()).format('YYYY.MM.DD HH:mm')}</span>
                      <DueCountDown dueDateTime={party.dueDateTime.toDate()} />
                    </PartyItemInfoText>
                  </div>
                  <PartyJoinners>
                    <PartyJoinnerPhoto>
                      {party.joinners && party.joinners.map((joinner, i) => (
                        <PartyJoinnerGroup key={i} className="tooltip-joinner" >
                          <img src={joinner.photoURL} alt={joinner.displayName} />
                          <span className="tooltiptext-joinner">{joinner.displayName}</span>
                        </PartyJoinnerGroup>
                      ))}
                    </PartyJoinnerPhoto>
                  </PartyJoinners>
                </PartyItemInfo>
              </div>
            </PartyItemContents>
          </PartyItem>
        ))}
      </div>
    )
  }
}

export default PartyList
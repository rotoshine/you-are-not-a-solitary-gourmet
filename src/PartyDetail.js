import React, { Component } from 'react'
import styled from 'styled-components'
import moment from 'moment'

import DueCountDown from './DueCountDown'
import PartyComments from './PartyComments'
import PartyJoinButton from './PartyJoinButton'

import { Overlay } from './CommonStyledComponents'
import {
  PartyTitle,
  PartyJoinners,
  PartyJoinnerPhoto,
  PartyJoinnerGroup,
  PartyTag,
  PartyItemInfoText
} from './PartyStyledComponents'

const PartyDetailGroup = styled.div`
  width: 600px;
  background: white;
  padding: 4rem 3rem;
  position: relative;
  border-radius: 6px;
  max-height: 90%;
  overflow-y: scroll;

  @media screen and (max-width: 600px) {
    border-radius: 0;
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    max-height: 100%;
  }
`

const PartyDetailContents = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  flex-direction: column;
`

const Block = styled.div`
  margin: 1rem 0;
`

const CloseButton = styled.button`
  position: absolute;
  right: 1rem;
  font-size: 1.4rem !important;
`

const PartyJoinButtonWrapper = styled.div`
  margin: 20px 0;
`

const ESC_KEY_CODE = 27

class PartyDetail extends Component {
  componentDidMount() {
    document.body.classList.add('modal-open');

    document.body.addEventListener('keyup', this.handleKeyPress)
  }

  componentWillUnmount() {
    document.body.classList.remove('modal-open');

    document.body.removeEventListener('keyup', this.handleKeyPress)
  }

  handleKeyPress = (evt) => {
    if (evt.keyCode !== ESC_KEY_CODE) return
    this.props.handleClose()
  }

  handleClickOverlay = (evt) => {
    if (evt.target.classList.value.indexOf('Overlay') < 0) return
    this.props.handleClose()
  }

  render() {
    const {
      party,
      renderMemberLimit,
      user,
      handleClose,
      onJoinParty,
      onLeaveParty,
    } = this.props

    return (
      <Overlay onClick={this.handleClickOverlay}>
        <PartyDetailGroup>
          <div className="PartyList__tags">
            <PartyTag>{party.category}</PartyTag>
            <PartyTag>{renderMemberLimit(party)}</PartyTag>
            <CloseButton
              className="btn btn-sm btn-light"
              onClick={handleClose}
            >닫기</CloseButton>
          </div>
          <div className="card-text">
            <PartyTitle>{party.title}</PartyTitle>
            <PartyJoinButtonWrapper>
              <PartyJoinButton user={user} party={party} onJoinParty={onJoinParty} onLeaveParty={onLeaveParty} />
            </PartyJoinButtonWrapper>
            <DueCountDown dueDateTime={party.dueDateTime.toDate()} />
            <PartyDetailContents>
              <Block>
                <h5>파티 상세 정보</h5>
                <PartyItemInfoText>
                  <span>장소 | </span>
                  <span>{party.destinationName}</span>
                </PartyItemInfoText>
                <PartyItemInfoText>
                  <span>일시 | </span>
                  <span>{moment(party.partyTime.toDate()).format('YYYY.MM.DD HH:mm')}</span>
                </PartyItemInfoText>
                <PartyItemInfoText>
                  <span><strong>{party.maxPartyMember}</strong> 명 중 <strong>{party.joinners.length}</strong> 명이 모였습니다.</span>
                </PartyItemInfoText>
              </Block>
              <Block>
                <h5>파티 설명</h5>
                <PartyItemInfoText>
                  <span>{party.description}</span>
                </PartyItemInfoText>
              </Block>
              <Block>
                <h5>누가 오나요?</h5>
                <PartyJoinners>
                  <PartyJoinnerPhoto>
                    {party.joinners && party.joinners.map((joinner, i) => (
                      <PartyJoinnerGroup className="tooltip-joinner" key={i}>
                        <img src={joinner.photoURL} alt={joinner.displayName} />
                        <span className="tooltiptext-joinner">{joinner.displayName}</span>
                      </PartyJoinnerGroup>
                    ))}
                  </PartyJoinnerPhoto>
                </PartyJoinners>
              </Block>
            </PartyDetailContents>
            <PartyComments user={user} partyId={party.id} />
          </div>
        </PartyDetailGroup>
      </Overlay>
    )
  }
}

export default PartyDetail

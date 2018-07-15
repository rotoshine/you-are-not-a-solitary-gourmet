import * as React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import * as moment from 'moment'

import DueCountDown from './DueCountDown'
import PartyComments from './PartyComments'
import PartyJoinButton from './PartyJoinButton'

import {
  PartyTitle,
  PartyJoinners,
  PartyJoinnerPhoto,
  PartyJoinnerGroup,
  PartyTag,
  PartyItemInfoText,
} from './PartyStyledComponents'

type Props = {
  party: Party,
  user: User | null,
  renderMemberLimit: Function,
  onJoinParty: Function,
  onLeaveParty: Function,
}

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
const PartyDetailHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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

const HeaderButton = styled.button`
  right: 1rem;
  font-size: 1.4rem !important;handleClickOverlay
`

const PartyJoinButtonWrapper = styled.div`
  margin: 20px 0;
`

export default class PartyDetail extends React.Component<Props> {
  render() {
    const {
      party,
      renderMemberLimit,
      user,
      onJoinParty,
      onLeaveParty,
    } = this.props

    const isCreator = (user && user.email === party.createdBy)

    return (
      <PartyDetailGroup onClick={(evt: React.SyntheticEvent) => evt.stopPropagation()}>
        <PartyDetailHeader>
          <div>
            <PartyTag>{party.category}</PartyTag>
            <PartyTag>{renderMemberLimit(party)}</PartyTag>
          </div>
          <div>
            {isCreator && (
              <Link to={`/parties/${party.id}/edit`}>
                <HeaderButton
                  className="btn btn-sm btn-info"
                >수정</HeaderButton>
              </Link>
            )}
            <Link to="/">
              <HeaderButton
                className="btn btn-sm btn-danger"
              >닫기</HeaderButton>
            </Link>
          </div>
        </PartyDetailHeader>
        <div className="card-text">
          <PartyTitle>{party.title}</PartyTitle>
          <PartyJoinButtonWrapper>
            <PartyJoinButton
              user={user}
              party={party}
              onJoinParty={onJoinParty}
              onLeaveParty={onLeaveParty} />
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
                <span>{moment(party.partyTime.toDate()).format('YYYY.MM.DD ddd HH:mm')}</span>
              </PartyItemInfoText>
              <PartyItemInfoText>
                <span>
                  <strong>{party.maxPartyMember}</strong>
                  <span>명 중 </span>
                  <strong>{party.joinners.length}</strong> 명이 모였습니다.
                  </span>
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
                  {
                    party.fetchedJoinners &&
                    party.fetchedJoinners.map((fetchedJoinner: User, i: number) => (
                      <PartyJoinnerGroup className="tooltip-joinner" key={i}>
                        <img src={fetchedJoinner.photoURL} alt={fetchedJoinner.displayName} />
                        <span className="tooltiptext-joinner">{fetchedJoinner.displayName}</span>
                      </PartyJoinnerGroup>
                    ))
                  }
                </PartyJoinnerPhoto>
              </PartyJoinners>
            </Block>
          </PartyDetailContents>
          <PartyComments user={user} partyId={party.id} />
        </div>
      </PartyDetailGroup>
    )
  }
}

import * as React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import * as moment from 'moment'

import DueCountDown from './DueCountDown'
import PartyComments from './PartyComments'
import PartyJoinButton from './PartyJoinButton'
import PartyTags from './PartyTags'

import {
  PartyTitle,
  PartyJoinners,
  PartyJoinnerPhoto,
  PartyJoinnerGroup,
  PartyItemInfoText,
} from './PartyStyledComponents'

type Props = {
  party: Party,
  user: User | null,
  onJoinParty: Function,
  onLeaveParty: Function,
}

const PartyDetailGroup = styled.div`
  width: 600px;
  background: white;
  padding: 4rem 3rem;
  position: absolute;
  top: 10rem;
  border-radius: 6px;
  margin-bottom: 4rem;
  @media screen and (max-width: 600px) {
    border-radius: 0;
    width: 100%;
    top: 0;
    margin-bottom: 0;
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
  font-size: 1.4rem !important;
`

const PartyJoinButtonWrapper = styled.div`
  margin: 20px 0;
`

export default class PartyDetail extends React.Component<Props> {
  renderMemberLimit(party: Party) {
    const { maxPartyMember, fetchedJoinners } = party

    if (!fetchedJoinners) {
      return false
    }

    if (maxPartyMember === 0) {
      return <span>무제한 멤버</span>
    }

    const joinnedMemberCount = fetchedJoinners.length

    if (maxPartyMember > joinnedMemberCount) {
      return (
        <span>총 {party.maxPartyMember}명</span>
      )
    }

    return <span>인원마감</span>
  }

  render() {
    const {
      party,
      user,
      onJoinParty,
      onLeaveParty,
    } = this.props

    const isCreator = (user && user.email === party.createdBy)

    if (party.id) {
      return (
        <PartyDetailGroup onClick={(evt: React.SyntheticEvent) => evt.stopPropagation()}>
          <PartyDetailHeader>
            <PartyTags party={party} />
            <div>
              {isCreator && (
                <Link to={`/parties/${party.id}/edit`}>
                  <HeaderButton
                    className="btn btn-sm btn-info"
                  >수정</HeaderButton>
                </Link>
              )}
            </div>
          </PartyDetailHeader>
          <div className="card-text">
            <PartyTitle>{party.title}</PartyTitle>
            <PartyJoinButtonWrapper>
              <PartyJoinButton
                user={user}
                party={party}
                onJoinParty={() => {
                  if (!user) {
                    alert('로그인 후 참여할 수 있습니다.')
                  } else {
                    onJoinParty()
                  }
                }}
                onLeaveParty={onLeaveParty} />
            </PartyJoinButtonWrapper>
            {
              party.category.hasDueDateTime && party.dueDateTime &&
              <DueCountDown counterName="마감시간" dueDateTime={party.dueDateTime.toDate()} />
            }
            <PartyDetailContents>
              <Block>
                <h5>파티 상세 정보</h5>
                {
                  party.category.isRestaurant &&
                  <PartyItemInfoText>
                    <span>식당 | </span>
                    <span>{party.destinationName}</span>
                  </PartyItemInfoText>
                }
                {
                  party.category.isTravel &&
                  <PartyItemInfoText>
                    <span>여행지 | </span>
                    <span>{party.destinationName}</span>
                  </PartyItemInfoText>
                }
                {
                  party.category.isPlaying &&
                  <PartyItemInfoText>
                    <span>하고 놀 것 | </span>
                    <span>{party.playName}</span>
                  </PartyItemInfoText>
                }
                <PartyItemInfoText>
                  <span>일시 | </span>
                  <span>{moment(party.partyTime.toDate()).format('YYYY.MM.DD ddd HH:mm')}</span>
                </PartyItemInfoText>
                <PartyItemInfoText>
                  {
                    party.maxPartyMember === 0 &&
                    <span>
                      파티원 수 제한이 없는 파티입니다.
                    </span>
                  }
                  {
                    party.maxPartyMember > 0 &&
                    (
                      <span>
                        <strong>{party.maxPartyMember}</strong>
                        <span>명 중 </span>
                        <strong>{party.joinners.length}</strong> 명이 모였습니다.
                    </span>
                    )
                  }
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
    return null
  }
}

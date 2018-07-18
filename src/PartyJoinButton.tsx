import * as React from 'react'
import styled from 'styled-components'

type Props = {
  party: Party,
  user: User | null,
  onJoinParty: Function,
  onLeaveParty: Function,
}

const isAlreadyJoin = (party: Party, user: User | null) =>
  user &&
  party.fetchedJoinners &&
  party.fetchedJoinners.find((joinner: User) => joinner.email === user.email)

const isFinished = (party: Party) => {
  if (party.category.hasDueDateTime && party.dueDateTime) {
    return party.dueDateTime.toDate() < new Date()
  }

  return false
}

const PartyButton = styled.button`
  background: #FF7744;
  border: #FF7744;
  color: white;
  padding: 1.4rem 0 !important;
  box-shadow: 0px 2px 16px rgba(255, 119, 68, 0.5);
  font-size: 1.4rem !important;
  transition: all 0.4s ease;
  width: 100%;
  border-radius: 6px;

  &:hover {
    transform: scale(0.98);
  }
`

const PartyJoinButton: React.SFC<Props> = ({
  party,
  user,
  onJoinParty,
  onLeaveParty,
}: Props) => {
  if (isAlreadyJoin(party, user)) {
    return (
      <PartyButton
        type="button"
        onClick={() => onLeaveParty(party.id, user && user.email)}>참여 취소하기</PartyButton>
    )
  }

  if (isFinished(party)) {
    return <span>저런! 파티 마감시간이 지났네요 :( </span>
  }

  return (<PartyButton onClick={() => onJoinParty(
    party.id, user && user.email,
  )}>파티합류!</PartyButton>)
}

export default PartyJoinButton

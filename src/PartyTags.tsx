import * as React from 'react'
import { PartyTag, PartyTagLimit, PartyTagDelivery } from './PartyStyledComponents'

type Props = {
  party: Party,
}

const renderMemberLimit = (party: Party) => {
  const { maxPartyMember, fetchedJoinners } = party

  if (!fetchedJoinners) {
    return null
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

const PartyTags: React.SFC<Props> = ({ party }) => (
  <div className="PartyTags">
    {party.category && (
      <PartyTag>{party.category}</PartyTag>
    )}
    <PartyTagLimit>{renderMemberLimit(party)}</PartyTagLimit>
    {party.isDelivery && <PartyTagDelivery>배달음식</PartyTagDelivery>}
  </div>
)

export default PartyTags

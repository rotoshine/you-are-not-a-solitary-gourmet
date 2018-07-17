import * as React from 'react'
import { PartyTag, PartyTagLimit, PartyTagDelivery } from './PartyStyledComponents'

interface Props {
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

const PartyTags: React.SFC<Props> = ({ party }) => {
  const { category } = party

  return (
    <div className="PartyTags">
      {category.isRestaurant && <PartyTag>식사</PartyTag>}
      {category.isDeliverable && <PartyTagDelivery>배달</PartyTagDelivery>}
      {category.isPlaying && <PartyTag>놀이</PartyTag>}
      {category.isTravel && <PartyTag>여행</PartyTag>}
      <PartyTagLimit>{renderMemberLimit(party)}</PartyTagLimit>
    </div>
  )
}

export default PartyTags

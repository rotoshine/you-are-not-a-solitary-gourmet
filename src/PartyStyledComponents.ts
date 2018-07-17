import styled from 'styled-components'

export const PartyTitle = styled.h2`
  margin-top: 2rem;
  font-size: 2.4rem;
`

export const PartyJoinnerGroup = styled.span`
  width: 100%;
  height: 100%;

  em {
    display:
  }
`

export const PartyTag = styled.span`
  width: 60px;
  background: orange;
  padding: 6px 10px;
  margin-right: 10px;
  line-height: 26px;
  font-size: 1.4rem;
  border-radius: 2px;
`

export const PartyTagLimit = PartyTag.extend`
  background: #20c997;
`

export const PartyTagDelivery = PartyTag.extend`
  background: #007bff;
`

export const PartyTagSoldOut = PartyTag.extend`
  background: #ff0018;
`

export const PartyJoinners = styled.div`
  margin: 0.6rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const PartyJoinnerPhoto = styled.div`
  display: flex;

  img {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    border: 1px solid #a5a5a5;
    margin-right: -1.5rem;
  }
`

export const PartyItemInfoText = styled.p`
  margin-bottom: 0.4rem;
  font-size: 1.6rem;
`

import * as React from 'react'
import { Link } from 'react-router-dom'
import * as moment from 'moment'

import DueCountDown from './DueCountDown'
import styled from './styled-components'
import PartyTags from './PartyTags'

import { PartyTitle, PartyItemInfoText } from './PartyStyledComponents'

type Props = {
  history?: {
    push: Function,
  },
  parties: Party[],
  user: User | null,
}

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
  width: 100%;
`

const PartyJoinnerPhoto = styled.div`
  display: flex;

  img {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    border: 1px solid #ccc;
    margin-right: -1.5rem;
  }
`

const PartyJoinnerGroup = styled.span`
  width: 100%;
  height: 100%;
`

export default class PartyList extends React.Component<Props> {
  handleClose = (e: EventTarget) => {
    this.props.history &&
      this.props.history.push('/')
  }

  alreadyJoin(party: Party) {
    const { user } = this.props

    if (user) {
      return party.fetchedJoinners &&
        party.fetchedJoinners.find(joinner => joinner.email === user.email)
    }
    return false
  }

  alreadyDeadline = (party: Party) => {
    return party.dueDateTime.toDate() < new Date()
  }

  renderMemberLimit(party: Party) {
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

  render() {
    const { parties } = this.props

    return (
      <div className="PartyList">
        {
          parties &&
          parties.length === 0 && (
            <h4 className="App__text-black">저런! 아무런 파티가 없군요. 파티를 직접 만들어보시는 건 어떨까요?</h4>
          )
        }
        {parties.map(party => (
          <Link key={party.id} className="Link" to={`/parties/${party.id}`}>
            <PartyItem
              className="PartyList__party"
            >
              <PartyItemContents>
                <PartyTags party={party} />
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
                        {party.fetchedJoinners && party.fetchedJoinners.map((joinner, i) => (
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
          </Link>
        ))}
      </div>
    )
  }
}

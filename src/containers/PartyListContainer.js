import React from 'react'
import { inject, observer } from 'mobx-react'

import PartyList from '../PartyList'

import { asyncSetState } from '../utils/misc'
import {
  unsubscribeTodayParties,  
  joinParty,
  leaveParty,
} from '../utils/party'

/*
type Props = {
  partyStore: IPartyStore,
  userStore: IUserStore,
}

type State = {
  initialize: boolean,
  nowPartiesLoading: boolean,
}*/

@inject('partyStore', 'userStore')
@observer
class PartyListContainer extends React.Component {
  componentDidMount() {
    this.initializeParties()
  }

  componentWillUnmount() {
    unsubscribeTodayParties()
  }

  async initializeParties() {   
    this.props.partyStore.initializeParties()
  }

  handleJoinPartyClick = async (partyId, email) => {
    await joinParty(partyId, email)
  }

  handleLeavePartyClick = async (partyId, email) => {
    await leaveParty(partyId, email)
  }

  render() {
    const { user, isExistUser } = this.props.userStore
    const { initialized, parties } = this.props.partyStore
    const initializedParty = this.props.partyStore.initialized

    return (
      <div className="PartyListContainer App__contents container album py-5">
        {
          !initializedParty && (
            <h3 className="App__text-black">파티를 불러오는 중</h3>
          )
        }
        {
          initializedParty && parties && (
            <h3 className="App__text-black">다가오는 파티 <span role="img" aria-label="eyes">👀</span></h3>
          )
        }

        {initializedParty && parties && (
          <PartyList
            user={user}
            parties={parties}
            onJoinParty={this.handleJoinPartyClick}
            onLeaveParty={this.handleLeavePartyClick}
          />
        )}
      </div>
    )
  }
}

export default PartyListContainer

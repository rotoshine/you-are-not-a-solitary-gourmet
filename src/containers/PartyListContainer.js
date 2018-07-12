import React from 'react'
import { inject, observer } from 'mobx-react'

import PartyList from '../PartyList'

import { asyncSetState } from '../utils/misc'
import {
  unsubscribeTodayParties,
  saveParty,
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
  state = {
    initialize: false,
    nowPartiesLoading: false,
  }

  componentDidMount() {
    this.initializeParties()
  }

  componentWillUnmount() {
    unsubscribeTodayParties()
  }

  async initializeParties() {
    this.setState({
      nowPartiesLoading: true,
    })

    this.props.partyStore.initializeParties()

    await asyncSetState(() => this.setState({
      initialize: true,
      nowPartiesLoading: false,
    }))
  }

  handleMakeParty = async (party) => {
    const { user } = this.props.userStore

    party.joinners = [
      user.email,
    ]

    await saveParty(party, user)
  }

  handleJoinPartyClick = async (partyId, email) => {
    await joinParty(partyId, email)
  }

  handleLeavePartyClick = async (partyId, email) => {
    await leaveParty(partyId, email)
  }

  render() {
    const { initialize } = this.state

    const { user, isExistUser } = this.props.userStore
    const { initialized, parties } = this.props.partyStore
    const initializedParty = this.props.partyStore.initialized

    return initialize && isExistUser && (
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
            onMakeParty={this.handleMakeParty}
            onJoinParty={this.handleJoinPartyClick}
            onLeaveParty={this.handleLeavePartyClick}
          />
        )}
      </div>
    )
  }
}

export default PartyListContainer

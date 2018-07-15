import * as React from 'react'
import { inject, observer } from 'mobx-react'

import PartyList from '../PartyList'

import { asyncSetState } from '../utils/misc'
import {
  unsubscribeTodayParties,
  saveParty,
  joinParty,
  leaveParty,
} from '../utils/party'

type Props = {
  partyStore?: IPartyStore,
  userStore?: IUserStore,
}

type State = {
  initialize: boolean,
  nowPartiesLoading: boolean,
}

@inject((allStores: IAllStore) => ({
  userStore: allStores.userStore as IUserStore,
  partyStore: allStores.partyStore as IPartyStore,
}))
@observer
class PartyListContainer extends React.Component<Props, State> {
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
    const { initializeParties } = this.props.partyStore!

    this.setState({
      nowPartiesLoading: true,
    })

    initializeParties()

    await asyncSetState(() => this.setState({
      initialize: true,
      nowPartiesLoading: false,
    }))
  }

  handleMakeParty = async (party: Party) => {
    const { user } = this.props.userStore!
    if (!user) return

    party.joinners = [
      user.email,
    ]

    await saveParty(party, user)
  }

  handleJoinPartyClick = async (partyId: string, email: string) => {
    await joinParty(partyId, email)
  }

  handleLeavePartyClick = async (partyId: string, email: string) => {
    await leaveParty(partyId, email)
  }

  render() {
    const { initialize } = this.state
    const { user, isExistUser } = this.props.userStore!
    const { initializedParty, parties } = this.props.partyStore!

    return initialize && isExistUser && (
      <div className="PartyListContainer App__contents container album py-5">
        {
          !initializedParty && (
            <h3 className="App__text-black">파티를 불러오는 중</h3>
          )
        }
        {
          initializedParty && parties && (
            <h3 className="App__text-black">
              다가오는 파티 <span role="img" aria-label="eyes">👀</span>
            </h3>
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

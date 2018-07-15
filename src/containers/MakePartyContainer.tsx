import * as React from 'react'
import { inject, observer } from 'mobx-react'

import MakeParty from '../MakeParty'

import { saveParty } from '../utils/party'

type Props = {
  userStore?: IUserStore,
  onClose: () => void,
}

@inject((allStores: IAllStore) => ({
  userStore: allStores.userStore as IUserStore,
}))
@observer
class MakePartyContainer extends React.Component<Props> {
  handleMakeParty = async (party: Party) => {
    const { user } = this.props.userStore!
    if (!user) return

    party.joinners = [
      user.email,
    ]

    await saveParty(party, user)
  }

  render() {
    return (
      <div className="MakePartyContainer">
        <MakeParty
          onMakeParty={this.handleMakeParty}
          onClose={this.props.onClose}
        />
      </div>
    )
  }
}

export default MakePartyContainer

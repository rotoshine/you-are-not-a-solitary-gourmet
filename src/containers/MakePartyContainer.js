import React from 'react'
import { inject, observer } from 'mobx-react'

import MakeParty from '../MakeParty'

import { saveParty } from '../utils/party'

/* 
type Props = {
  userStore: IUserStore,
  onClose: Function,
}
*/

@inject('userStore')
@observer
class MakePartyContainer extends React.Component {
  handleMakeParty = async (party) => {
    const { user } = this.props.userStore

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

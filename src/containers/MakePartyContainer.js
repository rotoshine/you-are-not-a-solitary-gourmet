import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

import MakeParty from '../MakeParty'

import { saveParty } from '../utils/partyUtils'

@inject('userStore')
@observer
class MakePartyContainer extends Component {
  handleMakeParty = async (party) => {
    const { user } = this.props.userStore

    party.joinners = [
      user.email
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

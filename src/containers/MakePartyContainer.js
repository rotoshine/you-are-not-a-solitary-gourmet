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
  handleMakeParty = async (partyForm) => {
    const { user } = this.props.userStore

    partyForm.joinners = [
      user.email,
    ]

    await saveParty(partyForm, user)
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

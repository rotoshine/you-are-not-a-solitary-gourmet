import * as React from 'react'
import { inject, observer } from 'mobx-react'

import PartyListContainer from '../containers/PartyListContainer'
import MakePartyContainer from '../containers/MakePartyContainer'

type Props = {
  userStore: IUserStore,
}

type State = {
  isOpen: boolean,
}

@inject('userStore')
@observer
class HomePage extends React.Component<Props, State> {
  state = {
    isOpen: false,
  }

  handleClick = () => {
    const { isExistUser } = this.props.userStore

    if (!isExistUser) {
      alert('로그인이 필요합니다!')
    } else {
      this.setState({ isOpen: true })
    }
  }

  handleClose = () => {
    this.setState({ isOpen: false })
  }

  render() {
    const { isExistUser } = this.props.userStore

    return (
      <div className="HomePage">
        {isExistUser && (
          <button
            className="App__button make"
            onClick={this.handleClick}
          >
            파티만들기
          </button>)
        }
        {this.state.isOpen && (
          <MakePartyContainer
            onClose={this.handleClose}
          />
        )}
        <PartyListContainer />
      </div>
    )
  }
}

export default HomePage

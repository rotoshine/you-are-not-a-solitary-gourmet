// @flow
import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'

import PartyListContainer from '../containers/PartyListContainer'
import MakePartyContainer from '../containers/MakePartyContainer'
import MakeParty from '../MakeParty'
import PartyList from '../PartyList'

const CATEGORIES = [
  { name: '점심', emoji: '🌮', color: '#FFB16B'},
  { name: '저녁', emoji: '🥘', color: '#FA6BFF' },
  { name: '간식', emoji: '☕️', color: '#FF6C72' },
  { name: '문화생활', emoji: '🍿', color: '#525FFF' },
  { name: '기타', emoji: '🎉', color: '#66BB66' },
]

@inject('userStore', 'partyStore')
@observer
class HomePage extends Component<Props> {
  state = {
    isOpen: false,
  }

  handleClick = () => {
    const { isExsitUser } = this.props.userStore

    if (!isExsitUser) {
      alert('로그인이 필요합니다!')
    } else {
      this.setState({ isOpen: true })
    }
  }

  handleClose = () => {
    this.setState({ isOpen: false })
  }

  render() {
    const { isExsitUser } = this.props.userStore
    const { parties } = this.props.partyStore

    return (
      <div className="HomePage">
        <button
          className="App__button make"
          onClick={this.handleClick}
        >
          파티만들기
        </button>
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

import React, { Component } from 'react'

import MakeParty from './MakeParty'

import './PartyList.css'

class PartyList extends Component {

  state = {
    isOpen: false
  }

  handleCloseButton = () => {
    this.setState({ isOpen: false })
  }

  makeNewParty = () => {
    this.setState({ isOpen: true })
  }

  render() {
    const { parties } = this.props
    const { isOpen } = this.state

    return (
      <div className="PartyList">
        {
          isOpen && <MakeParty
            handleCloseButton={this.handleCloseButton} 
            isOpen={isOpen} />
        }
        <div className="party-nav-group">
          <h2>원하는 파티를 찾아보세요!</h2>
          {
            parties.map(party => (
              <span className="party-nav">{party.category}</span>
            ))
          }
          <button
            className="party-make"
            onClick={this.makeNewParty}
          >파티만들기
          </button>
        </div>
        <div>
          <h2>오늘의 파티 전체보기</h2>
          <ul className="parties">
            { parties.map(party => (
              <li className="party">
                <div className="party-desc">
                  <div className="party-title">
                    <h3>{party.title}</h3>
                    <span className="party-category">{party.category}</span>
                    <span className="party-category">{party.maxPartyMember} 명</span>
                    {
                      party.isDelivery && <span className="party-category">배달</span>
                    }
                  </div>
                  {/* <p>{party.dueDateTime}</p> */}
                  <p>{party.description}</p>
                  <p>위치: {party.destinationName}</p>
                  <button>참석하기</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
  
        {parties.map(party => JSON.stringify(party))}
      </div>
    )
  }
}

export default PartyList
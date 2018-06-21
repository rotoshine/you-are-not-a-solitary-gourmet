import React, { Component } from 'react'

import './PartyList.css'

class PartyList extends Component {
  render() {
    const { parties } = this.props

    return (
      <div className="PartyList">
        <h3>오늘의 파티를 찾아보세요!</h3>
        <ul className="parties">
          { parties.map(party => (
            <li className="party">
              <div className="party-desc">
                <h3>{party.title}</h3>
                <p>{party.description}</p>
                <button>참석하기</button>
              </div>
            </li>
          ))}
        </ul>

        {parties.map(party => JSON.stringify(party))}
      </div>
    )
  }
}

export default PartyList
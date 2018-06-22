import React, { Component } from 'react'

import partyUtils from './utils/partyUtils'

import './MakeParty.css'

class MakeParty extends Component {

  state = {
    form: {
      category: '',
      title: '',
      destinationName: '',
      partyTime: '',
      description: ''
    }
  }

  handleFormChange = (field, value) => {
    const { form } = this.state
    this.setState({
      form: {
        ...form,
        [field]: value
      }
    })
  }
  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.state.form)
    partyUtils.addParty(this.state.form)
  }

  render() {

    const { form } = this.state

    return (
      <div className="MakeParty-overlay">
        <div className="MakeParty-group">
          <button
            className="close-button"
            onClick={this.props.handleClose}
          >x</button>
          <form 
            className="MakeParty-form"
            onSubmit={this.handleSubmit}>
            <input
              type="text"
              placeholder="카테고리를 입력해 주세요 (점심, 저녁, 간식)"
              value={form.category}
              onChange={(e) => this.handleFormChange('category', e.target.value)}
            />
            <input
              type="text"
              placeholder="파티의 타이틀을 입력해 주세요"
              value={form.title}
              onChange={(e) => this.handleFormChange('title', e.target.value)}
            />
            <input
              type="text"
              placeholder="식당, 장소 이름을 입력해 주세요"
              value={form.destinationName}
              onChange={(e) => this.handleFormChange('destinationName', e.target.value)}
            />
            <input
              type="datetime-local"
              value={form.partyTime}
              onChange={(e) => this.handleFormChange('partyTime', e.target.value)}
            />
            <textarea
              placeholder="파티를 설명해주세요!"
              value={form.description} onChange={e => this.handleFormChange('description', e.target.value)} />
            <button className="submit">submit</button>
          </form>
        </div>
      </div>
    )
  }
}

export default MakeParty
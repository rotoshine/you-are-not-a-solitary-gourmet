import React, { Component } from 'react'

import partyUtils from './utils/partyUtils'


export default class FBTest extends Component {
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
    partyUtils.addParty(this.state.form)
  }

  render() {
    const { form } = this.state

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input 
            type="text"
            placeholder="category" 
            value={form.category} 
            onChange={(e) => this.handleFormChange('category', e.target.value)}
          />
          <input 
            type="text" 
            placeholder="title"
            value={form.title} 
            onChange={(e) => this.handleFormChange('title', e.target.value)}
          />
          <input 
            type="text" 
            placeholder="destinationName"
            value={form.destinationName} 
            onChange={(e) => this.handleFormChange('destinationName', e.target.value)}
          />
          <input 
            type="datetime-local"
            value={form.partyTime}
            onChange={(e) => this.handleFormChange('partyTime', e.target.value)}
          />
          <textarea value={form.description} onChange={e => this.handleFormChange('description', e.target.value)} />
          <button className="submit">submit</button>
        </form>
      </div>
    )
  }
}
import React, { Component } from 'react'

import UserContext from './context/UserContext'

import commentUtils from './utils/commentUtils'

export default class CommentTestForm extends Component {
  state = {
    form: {
      partyId: 'xafTpXiSIU5tw8yNQFGg',
      content: ''
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

    const { user } = this.props
    console.log(this.state.form)

    const comment = { ...this.state.form }
    comment.user = {
      ...user
    }

    commentUtils.addComment(comment)
  }

  render() {
    const { form } = this.state

    return (
      <UserContext.Consumer>
        { user => (
          <div>
            {JSON.stringify(user)}
            <form onSubmit={this.handleSubmit}>
              <input 
                type="text"
                placeholder="partyId" 
                value={form.partyId} 
                onChange={(e) => this.handleFormChange('partyId', e.target.value)}
              />
              <input 
                type="text"
                placeholder="content" 
                value={form.content} 
                onChange={(e) => this.handleFormChange('content', e.target.value)}
              />
              <button>submit</button>
            </form>
          </div>
        )}
      </UserContext.Consumer>
    )
  }
}
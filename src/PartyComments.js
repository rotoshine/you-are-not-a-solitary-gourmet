import React, { Component } from 'react'
import moment from 'moment'
import { subscribeComments, unsubscibeComments, addComment, removeComment } from './utils/commentUtils'

import './PartyComments.css'

export default class PartyComments extends Component {
  state = {
    insertedComment: '',
    comments: null
  }

  async componentDidMount() {
    subscribeComments(this.props.partyId, (comments) => {      
      this.setState({ comments })
    })      
  }

  componentWillUnmount() {
    unsubscibeComments()
  }

  async asyncSetState(state) {
    return new Promise((resolve) => this.setState(state, resolve))
  }

  handleAddComment = async (e) => {
    e.preventDefault()

    // 낙관적 업데이트
    const { comments, insertedComment } = this.state
    const { partyId, user } = this.props

    const insertComment = {
      partyId,
      user,
      content: insertedComment
    }

    await this.asyncSetState({
      comments: comments ? [...comments, insertComment] : [insertComment],
      insertedComment: ''
    })
    await addComment(insertComment)
  }

  handleCommentRemoveClick = async (commentId, index) => {
    // 낙관적 업데이트
    const comments = [...this.state.comments]
    comments.splice(index, 1)
    await this.asyncSetState({
      comments
    })

    await removeComment(commentId)
  }

  render() {
    const { comments, insertedComment } = this.state
    const { user } = this.props

    return (
      <div className="PartyComments">
        <ul className="PartyComments__list">
          {comments && comments.length === 0 && (
            <li>이 파티에 대한 댓글이 하나도 없네요.</li>
          )}
          {comments && comments.map((comment, i) => (
            <li key={i} className="PartyComments__comment">
              <img src={comment.user.photoURL} alt={`${comment.user.displayName} profile`} />
              <div className="PartyComments__commentUser comment-text">{comment.user.displayName}</div>
              <div className="PartyComments__commentContent comment-text">{comment.content}</div>
              <div className="partyComments__createdAt comment-text">{comment.createdAt ? moment().fromNow(comment.createdAt.toDate()) : '작성 중'}</div>
              <div className="PartyComments__actions">
                {user && comment.createdBy === user.email &&
                  <button className="btn btn-sm btn-light" onClick={() => this.handleCommentRemoveClick(comment.id, i)}>x</button>
                }
              </div>
            </li>
          ))}
          {user &&
            <li className="PartyComments__comment PartyComments__comment--input">
              <img src={user.photoURL} alt={`${user.displayName} profile`} />
              <div className="PartyComments__commentUser">{user.displayName}</div>
              <form onSubmit={this.handleAddComment}>
                <input type="text" value={insertedComment}
                  onChange={(e) => this.setState({ insertedComment: e.target.value })}
                />
              </form>
            </li>
          }
        </ul>
      </div>
    )
  }
}
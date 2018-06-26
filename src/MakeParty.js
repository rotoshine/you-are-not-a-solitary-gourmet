import React, { Component } from 'react'

import './MakeParty.css'

class MakeParty extends Component {
  state = {
    form: {
      category: '',
      title: '',
      destinationName: '',
      partyTime: '',
      dueDateTime: '',
      description: '',
      isDelivery: false,
      maxPartyMember: 0
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
  handleSubmit = async (e) => {
    e.preventDefault();
    
    const { form } = this.state
    const { onMakeParty, onClose } = this.props

    const { dueDateTime, partyTime } = form
    
    const current = new Date()

    // TODO form validation 붙이자    
    if (dueDateTime < current) {
      alert('마감일은 오늘 이전일 수 없습니다.')
      return
    } 

    if (partyTime < current) {
      alert('파티일은 오늘 이전일 수 없습니다.')
      return
    }

    await onMakeParty(form)

    onClose()
  }

  render() {

    const { form } = this.state

    return (
      <div className="MakeParty-overlay">
        <div className="MakeParty-group">
          <button
            className="btn btn-outline-success"
            onClick={this.props.onClose}
          >x</button>
          <form
            className="MakeParty-form"
            onSubmit={this.handleSubmit}>
            <div>
              <label htmlFor="category">카테고리</label>
              <input
                id="category"
                type="text"
                placeholder="카테고리를 입력해 주세요 (점심, 저녁, 간식)"
                value={form.category}
                onChange={(e) => this.handleFormChange('category', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="title">파티 제목</label>
              <input
                id="title"
                type="text"
                placeholder="무엇을 하는 파티인가요?"
                value={form.title}
                onChange={(e) => this.handleFormChange('title', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="destinationName">행선지</label>
              <input
                id="destinationName"
                type="text"
                placeholder="식당, 장소 이름을 입력해 주세요"
                value={form.destinationName}
                onChange={(e) => this.handleFormChange('destinationName', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="partyTime">언제 먹나요?</label>
              <input
                id="partyTime"
                type="datetime-local"
                placeholder="언제 먹나요?"
                value={form.partyTime}
                onChange={(e) => this.handleFormChange('partyTime', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="dueDateTime">파티 모집 마감 시간</label>
              <input
                id="dueDateTime"
                type="datetime-local"
                placeholder="파티 모집 마감시간은 언제인가요?"
                value={form.dueDateTime}
                onChange={(e) => this.handleFormChange('dueDateTime', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="maxPartyMember">파티 모집 인원</label>
              <input
                id="maxPartyMember"
                type="number"
                placeholder="몇명까지 모을건가요? 0인 경우 무제한입니다."
                value={form.maxPartyMember}
                onChange={(e) => this.handleFormChange('maxPartyMember', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="isDelivery">배달음식인가요?</label>
              <input type="checkbox" id="isDelivery" value={form.isDelivery} onChange={(e) => this.handleFormChange('isDelivery', e.target.checked)} />
            </div>
            <textarea
              placeholder="파티를 설명해주세요!"
              rows={8}
              value={form.description} onChange={e => this.handleFormChange('description', e.target.value)} />
            <button className="btn btn-outline-success">파티를 만듭니다!</button>
          </form>
        </div>
      </div>
    )
  }
}

export default MakeParty
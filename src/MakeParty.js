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
          <div className="MakeParty-title">
            <h3><span role="img" aria-label="tada">🎉</span> 파티 만들기</h3>
            <button
              className="btn btn-sm btn-light onclick"
              onClick={this.props.onClose}
            >닫기</button>
          </div>
          <form
            className="MakeParty-form"
            onSubmit={this.handleSubmit}>
            <div className="form-row">
            <div className="form-group col-sm-9">
              <label
                htmlFor="title">
                파티 제목
              </label>
              <input
                type="text"
                className="MakeParty__form-control form-control"
                id="title"
                placeholder="파티제목" 
                value={form.title}
                onChange={(e) => this.handleFormChange('title', e.target.value)}
              />
            </div>
            <div className="form-group col-sm-3">
              <label htmlFor="isDelivery">배달음식?</label>
              <input
                className="MakeParty__form-control form-control"
                type="checkbox"
                name="isDelivery"
                id="isDelivery"
                value={form.isDelivery}
                onChange={(e) => this.handleFormChange('isDelivery', e.target.checked)}
              />
            </div>
            </div>
              <div className="form-group">
                <label
                  htmlFor="category"
                >
                카테고리
                </label>
                <div className="MakeParty__inline">
                {['점심', '저녁', '간식', '기타'].map(
                    (category) => (
                      <div 
                        key={category}
                        className="MakeParty__checkbox form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="categoryOptions"
                          id="category"
                          value={category}
                          checked={form.category === category}
                          onChange={(e) => this.handleFormChange('category', e.target.value)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="category"
                        >
                          {category}
                        </label>
                      </div>
                    )
                  )
                }
              </div>
            </div>
            <div className="form-row">
            <div className="form-group col-sm-9">
              <label
                htmlFor="destinationName">
                행선지
              </label>
              <input
                type="text"
                className="MakeParty__form-control form-control"
                id="title"
                placeholder="식당, 장소이름을 입력해 주세요" 
                value={form.destinationName}
                onChange={(e) => this.handleFormChange('destinationName', e.target.value)}
              />
            </div>
            <div className="form-group col-sm-3">
              <label htmlFor="maxPartyMember">인원 (무제한:0)</label>
              <input
                id="maxPartyMember"
                className="MakeParty__form-control form-control"
                type="number"
                value={form.maxPartyMember}
                onChange={(e) => this.handleFormChange('maxPartyMember', e.target.value)}
              />
            </div>
            </div>
            <div className="form-row">
            <div className="form-group col-sm-6">
              <label
                htmlFor="partyTime">언제 먹나요?</label>
              <input
                id="partyTime"
                className="MakeParty__form-control form-control"
                type="datetime-local"
                placeholder="언제 먹나요?"
                value={form.partyTime}
                onChange={(e) => this.handleFormChange('partyTime', e.target.value)}
              />
            </div>
            <div className="form-group col-sm-6">
              <label htmlFor="dueDateTime">파티 모집 마감 시간</label>
              <input
                id="dueDateTime"
                className="MakeParty__form-control form-control"
                type="datetime-local"
                placeholder="파티 모집 마감시간은 언제인가요?"
                value={form.dueDateTime}
                onChange={(e) => this.handleFormChange('dueDateTime', e.target.value)}
              />
            </div>
            </div>
            <div className="form-group">
              <label htmlFor="description">자세한 정보를 입력하세요</label>
              <textarea
                placeholder="파티를 설명해주세요!"
                className="MakeParty__form-control form-control"
                rows={8}
                value={form.description} onChange={e => this.handleFormChange('description', e.target.value)} />
            </div>
            <button className="MakeParty__button btn">파티를 만듭니다!</button>
          </form>
        </div>
      </div>
    )
  }
}

export default MakeParty
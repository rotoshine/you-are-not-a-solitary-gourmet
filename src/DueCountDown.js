import React, { Component } from 'react'
import moment from 'moment'
moment.locale('ko')

export default class DueCountDown extends Component {
  constructor(props) {
    super(props)
    this.timer = null
    this.state = {
      dueCountDown: new Date(props.dueDateTime).getTime(),
      now: new Date().getTime()
    }
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({
        now: new Date().getTime()
      })
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  render() {
    const { dueCountDown, now } = this.state

    return (
      <div className="DueCountDown">
        <span>마감까지 {moment.utc(moment(dueCountDown).diff(moment(now))).format('HH:mm:ss')} 남았습니다!</span>
      </div>
    )
  }
}

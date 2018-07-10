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

    if (dueCountDown < now) {
      return (
        <span className="DueCountDown">
          마감시간 지났군요<span role="img" aria-label="cry-face">😢</span>
        </span>
      )
    }

    const durationTime = moment.duration(moment(dueCountDown).diff(moment(now))).humanize()

    return (
      <span className="DueCountDown">
        마감까지 <em className="DueCountDown__time">{durationTime}</em> 남았습니다!
      </span>
    )
  }
}

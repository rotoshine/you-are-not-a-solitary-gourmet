import * as React from 'react'
import styled from 'styled-components'
import * as moment from 'moment'
moment.locale('ko')

type Props = {
  dueDateTime: Date,
}

type State = {
  dueCountDown: number,
  now: number,
}

const DueCountDownWrapper = styled.span`
  color: #ff2700;
  padding-left: 1rem;
  font-size: 1.6rem;
`

const DueCountDownTime = styled.em`
  font-weight: 600;
  color: #ff2700;
`
export default class DueCountDown extends React.Component<Props, State> {
  timer: number | undefined
  constructor(props: Props) {
    super(props)
    this.timer = undefined
    this.state = {
      dueCountDown: new Date(props.dueDateTime).getTime(),
      now: new Date().getTime(),
    }
  }

  componentDidMount() {
    this.timer = window.setInterval(
      () => {
        this.setState({
          now: new Date().getTime(),
        })
      },
      1000,
    )
  }

  componentWillUnmount() {
    window.clearInterval(this.timer)
  }

  render() {
    const { dueCountDown, now } = this.state

    if (dueCountDown < now) {
      return (
        <DueCountDownWrapper>
          마감시간 지났군요<span role="img" aria-label="cry-face">😢</span>
        </DueCountDownWrapper>
      )
    }

    const durationTime = moment.duration(moment(dueCountDown).diff(moment(now))).humanize()

    return (
      <DueCountDownWrapper>
        마감까지 <DueCountDownTime>{durationTime}</DueCountDownTime> 남았습니다!
      </DueCountDownWrapper>
    )
  }
}

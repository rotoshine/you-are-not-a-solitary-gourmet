// @flow
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

import GoogleLoginButton from './GoogleLoginButton'

type Props = {
}

@inject('userStore')
@observer
class AuthenticateHeader extends Component<Props> {
  state = {
    userInitialized: false,
  }

  componentDidMount() {
    this.initializeUser()
  }

  async initializeUser() {
    await this.props.userStore.initializeUser()

    await this.asyncSetState({
      userInitialized: true,
    })
  }

  async asyncSetState(state) {
    return new Promise((resolve) => this.setState(state, resolve))
  }

  render() {
    const { userInitialized } = this.state
    const { user, signOut } = this.props.userStore

    return (
      <div className="AuthenticateHeader">
        {!userInitialized && (
        <div className="App__constraint">
          <div className="App__intro">
            <div className="App__container container">
              <h2 className="App__container-header">'안 고독한 미식가<span role="img" aria-label="fire">🔥</span>'</h2>
              <p className="App__text">안고미 클라우드에서 데이터를 긁어오는중 삐리리~</p>
            </div>
          </div>
        </div>
        )}
        {userInitialized && !user && (
        <div className="App__constraint">
            <div className="App__header">
              <GoogleLoginButton />
            </div>
          <div className="App__intro">
            <div className="App__container container">
              <small>안 고독한 미식가</small>
              <h2 className="App__container-header">오늘도 혼자인가요?</h2>
              <h2 className="App__container-header">더이상 혼자 먹지 마세요.</h2>
              <p className="App__text">다양한 파티에 참여해보세요. 로그인 후 이용할 수 있습니다.</p>
            </div>
          </div>
        </div>
        )}
        {userInitialized && user && (
          <div className="App">
            <div className="App__header">
              <form>
                <button
                  className="App__button"
                  onClick={signOut}
                >
                  로그아웃
                </button>
              </form>
            </div>
            <div className="App__intro App__intro-member">
              <div className="App__container container">
                <small>안 고독한 미식가</small>
                <h2 className="App__container-header">오늘도 혼자인가요?</h2>
                <h2 className="App__container-header">더이상 혼자 먹지 마세요.</h2>
                <p className="App__text">원하는 파티가 없다구요? 직업 파티를 만들어보세요.</p>
              </div>
            </div>
          </div>
          )}
      </div>
    )
  }
}

export default AuthenticateHeader

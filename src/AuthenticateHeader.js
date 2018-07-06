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
        <h2 className="jumbotron-heading">안 고독한 미식가</h2>
        {!userInitialized && 'Loading...'}
        {userInitialized && !user && (
          <div>
            <p className="lead">그대여 오늘도 혼자인가요? 안 고독한 미식가와 함께 더 이상 혼자 먹지 마세요.</p>
            <GoogleLoginButton />
          </div>
        )}
        {userInitialized && user && (
          <div>
            <p className="lead">{user.displayName}, 오늘도 혼자인가요? 안 고독한 미식가와 함께 더 이상 혼자 먹지 마세요.</p>
            <form className="form-inline my-2 my-lg-0">
              <button className="btn btn-success my-2" onClick={signOut}>Logout</button>
            </form>
          </div>
        )}
      </div>
    )
  }
}

export default AuthenticateHeader

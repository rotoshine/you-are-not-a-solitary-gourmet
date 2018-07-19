import * as React from 'react'
import { inject, observer } from 'mobx-react'

import GoogleLoginButton from './GoogleLoginButton'

import { asyncSetState } from './utils/misc'

interface Props { }
interface InjectedProps extends Props {
  userStore: IUserStore,
}

@inject((allStores: IAllStore) => ({
  userStore: allStores.userStore as IUserStore,
}))
@observer
class AuthenticateHeader extends React.Component<Props> {
  state = {
    userInitialized: false,
  }

  componentDidMount() {
    this.initializeUser()
  }

  async initializeUser() {
    const { userStore } = this.props as InjectedProps

    await userStore.initializeUser()

    await asyncSetState(() => {
      this.setState({
        userInitialized: true,
      })
    })
  }

  render() {
    const { userInitialized } = this.state
    const { userStore } = this.props as InjectedProps
    const { isExistUser, signOut } = userStore

    return (
      <div className="AuthenticateHeader">
        {!userInitialized && (
          <div className="App__constraint">
            <div className="App__intro">
              <div className="App__container container">
                <h2 className="App__container-header">
                  '안 고독한 미식가<span role="img" aria-label="fire">🔥</span>'
                </h2>
                <p className="App__text">안고미 클라우드에서 데이터를 긁어오는중 삐리리~</p>
              </div>
            </div>
          </div>
        )}
        {userInitialized && (
          <div className="App">
            <div className="App__header">
              {
                isExistUser ? (
                  <form>
                    <button
                      className="App__button"
                      onClick={signOut}
                    >
                      로그아웃
                    </button>
                  </form>
                ) : <GoogleLoginButton />
              }
            </div>
            <div className="App__intro App__intro-member">
              <div className="App__container container">
                <small>안 고독한 미식가</small>
                <h2 className="App__container-header">오늘도 혼자인가요?</h2>
                <h2 className="App__container-header">더이상 혼자 먹지 마세요.</h2>
                <p className="App__text">원하는 파티가 없다구요? 직접 파티를 만들어보세요.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default AuthenticateHeader

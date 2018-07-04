import React, { Component } from 'react'
import { signIn } from './utils/userUtils'

export default class GoogleLoginButton extends Component {
  render () {
    return (
      <a className="nav-link" onClick={() => signIn()}>Sign In</a>
    )
  }
}

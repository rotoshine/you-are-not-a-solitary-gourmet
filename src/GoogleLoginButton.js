import React, { Component } from 'react'
import { signIn } from './utils/userUtils'

export default class GoogleLoginButton extends Component {
  render () {
    return (
      <button className="signIn" type="button" onClick={() => signIn()}>Google Sign In</button>
    )
  }
}

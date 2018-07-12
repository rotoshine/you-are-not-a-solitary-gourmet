import './index.css'

import 'moment/locale/ko'

import React from 'react'
import ReactDOM from 'react-dom'

import Root from './Root'
import registerServiceWorker from './registerServiceWorker'

import 'bootstrap/dist/css/bootstrap.min.css'

ReactDOM.render((
  <Root />
), document.getElementById('root'))
registerServiceWorker();

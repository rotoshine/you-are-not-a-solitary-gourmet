import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import 'moment/locale/ko'

import * as React from 'react'
import * as ReactDOM from 'react-dom'

import Root from './Root'
import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(
  (
    <Root />
  ),
  document.getElementById('root') as HTMLDivElement,
)
registerServiceWorker()

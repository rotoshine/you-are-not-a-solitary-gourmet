import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import 'moment/locale/ko'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'

import App from './App'

import stores from './stores'

import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(
  (
    <Provider {...stores}>
      <App />
    </Provider>
  ),
  document.getElementById('root') as HTMLDivElement,
)
registerServiceWorker()

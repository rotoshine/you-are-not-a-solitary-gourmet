import axios from 'axios'
import { isString } from 'lodash'
const SLACK_HOOK = process.env.REACT_APP_SLACK_HOOK

export const isValidSlackHook = () => (
  isString(SLACK_HOOK) &&
  SLACK_HOOK.indexOf('https://') === 0
)

export const notifyToSlack = async (text: string) => {
  if (text && text.length > 0 && isValidSlackHook()) {
    const options = {
      text,
    }

    try {
      if (SLACK_HOOK) {
        await axios.post(SLACK_HOOK, JSON.stringify(options))
      }
      return true
    } catch (e) {
      console.log(e)
    }
  }

  return false
}

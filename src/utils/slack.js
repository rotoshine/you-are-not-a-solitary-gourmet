import axios from 'axios'

const SLACK_HOOK = process.env.REACT_APP_SLACK_HOOK

export const isValidSlackHook = () => SLACK_HOOK && typeof SLACK_HOOK === 'string' && SLACK_HOOK.indexOf('https://') === 0

export const notifyToSlack = async (text) => {
  if (text && text.length > 0 && isValidSlackHook()) {
    const options = {
      text,
    }
  
    try {
      await axios.post(SLACK_HOOK, JSON.stringify(options))
      return true
    } catch(e) {
      console.log(e)      
    }
  }
  
  return false
}

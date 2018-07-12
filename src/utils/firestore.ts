import firebase from './firebase'

const firestore = firebase.firestore()

const settings = {
  timestampsInSnapshots: true,
}

firestore.settings(settings)

export const createSubscribe = (query: any, callback: Function) => {
  return {
    subscibe: query.onSnapshot(callback),
    unsubscribe: query.onSnapshot(() => {}),
  }
}

export default firestore

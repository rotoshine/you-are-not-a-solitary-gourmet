import firebase from './firebase'

const db = firebase.firestore()

const settings = {
  timestampsInSnapshots: true
}

db.settings(settings)


export const createSubscribe = (query, callback) => {
  return {
    subscibe: query.onSnapshot(callback),
    unsubscribe: query.onSnapshot(() => {})
  }
}

export default db

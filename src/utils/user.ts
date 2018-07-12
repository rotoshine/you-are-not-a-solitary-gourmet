import * as Bluebird from 'bluebird'
import firebase from './firebase'
import firestore from './firestore'

export const addUser = async (user: User) => {
  const addedUser = await firestore.collection('users').add(user)
  return addedUser
}

export const addUserIfNotExist = async (user: User) => {
  const alreadyAddedUser = await findByEmail(user.email)

  if (!alreadyAddedUser) {
    return addUser(user)
  }

  return null
}

export const findOneById = async (id: string): Promise<User | null> => {
  const querySnapshot: any = await firestore.collection('users').doc(id).get()

  if (querySnapshot) {
    return querySnapshot.data()
  }

  return null
}

export const findByIds = async (ids: string[]): Promise<any> => {
  if (!ids || ids.length === 0) {
    return new Promise((resolve) => {
      resolve([])
    })
  }
  return Bluebird.map(ids, async (id: string) => await findOneById(id))
}

export const findByEmails = async (emails: string[]) => {
  return Bluebird.map(emails, async (email: string) => await findByEmail(email))
}

export const findByEmail = async (email: string): Promise<User | null> => {
  const querySnapshot = await firestore.collection('users').where('email', '==', email).get()

  if (querySnapshot && querySnapshot.size > 0) {
    return <User>querySnapshot.docs[0].data()
  }

  return null
}

export const signIn = () => {
  const { auth } = firebase
  const { Auth, GoogleAuthProvider } = auth
  const provider = new GoogleAuthProvider()

  auth().setPersistence(Auth.Persistence.LOCAL)
  auth().signInWithRedirect(provider)
}

export const loadCurrentUser = async (): Promise<User | null> => {
  try {
    const result = await firebase.auth().getRedirectResult()

    let user: User
    if (result && result.credential) {
      user = <User>result.user
    } else {
      user = <User>firebase.auth().currentUser
    }

    if (user) {
      const { displayName, email, photoURL } = user

      await addUserIfNotExist({
        email,
        displayName,
        photoURL,
      })

      return {
        displayName,
        email,
        photoURL,
      }
    }
  } catch (e) {
    console.log(e)
  }

  return null
}

export const handleSignOut = async () => {
  await firebase.auth().signOut()
}

export default {
  addUser,
  addUserIfNotExist,
  findOneById,
  findByIds,
  findByEmail,
  signIn,
  loadCurrentUser,
  handleSignOut,
}

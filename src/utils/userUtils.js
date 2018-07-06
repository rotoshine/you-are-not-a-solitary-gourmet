import Promise from 'bluebird'
import firebase from './firebase'
import db from './firestore'


export const addUser = async (user) => {
  const addedUser = await db.collection('users').add(user)
  return addedUser
}

export const addUserIfNotExist = async(user) => {
  const alreadyAddedUser = await findByEmail(user.email)

  if(!alreadyAddedUser) {
    return addUser(user)
  }

  return null
}

export const findOneById = async(id) => {
  const querySnapshot = await db.collection('users').doc(id).get()

  if (querySnapshot) {
    return querySnapshot.data()
  }

  return null
}

export const findByIds = async(ids) => {
  if(!ids || ids.length === 0) {
    return new Promise((resolve) => {
      resolve([])
    })
  }
  return Promise.map(ids, async(id) => await findOneById(id))
}

export const findByEmails = async(emails) => {
  return Promise.map(emails, async(email) => await findByEmail(email))  
}

export const findByEmail = async(email) => {
  const querySnapshot = await db.collection('users').where('email', '==', email).get()

  if (querySnapshot && querySnapshot.size > 0) {
    return querySnapshot.docs[0].data()
  }
}

export const signIn = () => {
  const { auth } = firebase
  const { Auth, GoogleAuthProvider } = auth
  const provider = new GoogleAuthProvider()  
  
  auth().setPersistence(Auth.Persistence.LOCAL)  
  auth().signInWithRedirect(provider)
}

export const loadCurrentUser = async() => {  
  try {
    const result = await firebase.auth().getRedirectResult()
        
    let user;
    if (result && result.credential) {
      user = result.user
    } else {
      user = firebase.auth().currentUser      
    }
    
    if (user) {      
      const { displayName, email, photoURL } = user

      await addUserIfNotExist({
        email,
        displayName,
        photoURL
      })

      return {
        displayName,
        email,
        photoURL
      }
    }
  } catch(e) {
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
  handleSignOut
}
const { firebase } = window

const db = firebase.firestore()

export const addUser = async (user) => {
  const addedUser = await db.collection('users').add(user)

  return addedUser
}

export const addUserIfNotExist = async(user) => {
  const alreadyAddedUser = await findByEmail(user.email)

  if(!alreadyAddedUser) {
    addUser(user)
  }
}

export const findOneById = async(id) => {
  const querySnapshot = await db.collection('users').doc(id).get()

  if (querySnapshot) {
    return querySnapshot.data()
  }

  return null
}

export const findByIds = async(ids) => {
  return ids.map(async(id) => await findOneById(id))
}

export const findByEmail = async(email) => {
  const querySnapshot = await db.collection('users').where('email', '==', email).get()

  if (querySnapshot && querySnapshot.size > 0) {
    return querySnapshot.docs[0].data()
  }
}



export default {
  addUser,
  addUserIfNotExist,
  findOneById,
  findByIds,
  findByEmail
}
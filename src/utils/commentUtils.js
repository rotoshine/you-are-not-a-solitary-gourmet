const { firebase } = window

const db = firebase.firestore()

export const addComment = async (comment) => {
  console.log(comment)
  const { partyId, content, user } = comment
  const addedCommemt = await db.collection('comments').add({
    partyId,
    user,
    content,
    cratedAt: new Date().getTime()
  })

  return addedCommemt
}

export const findCommentsByPartyId = async(partyId) => {
  const querySnapshot = await db.collection('comments').where('partyId', '==', partyId).get()

  if (querySnapshot) {
    return querySnapshot.docs.map((doc) => doc.data())
  }
}

export default {
  addComment,
  findCommentsByPartyId
}
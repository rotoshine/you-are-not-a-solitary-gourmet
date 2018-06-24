import db from './firestore'

const querySnapshotToArray = (querySnapshot) => (
  querySnapshot.docs
    .map((doc) => ({
      ...doc.data(),
      id: doc.id
    }))
    .filter((comment) => comment.isDisplay)
    .sort((a, b) => a.createdAt.toDate() > b.createdAt.toDate())
)

export const addComment = async (comment) => {
  const { partyId, content, user } = comment
  const addedCommemt = await db.collection('comments').add({
    partyId,
    user,
    content,
    isDisplay: true,
    createdBy: user.email,
    createdAt: new Date()
  })

  return addedCommemt
}

export const findCommentsByPartyId = async (partyId) => {
  const querySnapshot = await db
    .collection('comments')
    .where('partyId', '==', partyId)
    .get()

  if (querySnapshot) {
    return querySnapshotToArray(querySnapshot)
  }
}

export const removeComment = async (commentId) => {
  await db.collection('comments').doc(commentId).update({
    isDisplay: false
  })
}

export const subscribeComments = (partyId, callback) => {
  db.collection('comments')
    .where('partyId', '==', partyId)
    .onSnapshot((querySnapshot) => {
      return callback(querySnapshotToArray(querySnapshot))
    })
}

export const unsubscibeComments = () => {
  db.collection('comments').onSnapshot(() => {})
}

export default {
  addComment,
  findCommentsByPartyId,
  removeComment,
  subscribeComments,
  unsubscibeComments
}
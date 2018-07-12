import firestore from './firestore'

const querySnapshotToArray = (querySnapshot: any) => (
  querySnapshot.docs
    .map((doc: any) => ({
      ...doc.data(),
      id: doc.id,
    }))
    .filter((comment: PartyComment) => comment.isDisplay)
    .sort((a: PartyComment, b: PartyComment) => a.createdAt.toDate() > b.createdAt.toDate())
)

export const addComment = async (comment: PartyComment) => {
  const { partyId, content, user } = comment
  const addedCommemt = await firestore.collection('comments').add({
    partyId,
    user,
    content,
    isDisplay: true,
    createfirestorey: user.email,
    createdAt: new Date(),
  })

  return addedCommemt
}

export const findCommentsByPartyId = async (partyId: string) => {
  const querySnapshot = await firestore
    .collection('comments')
    .where('partyId', '==', partyId)
    .get()

  if (querySnapshot) {
    return querySnapshotToArray(querySnapshot)
  }
}

export const removeComment = async (commentId: string) => {
  await firestore.collection('comments').doc(commentId).update({
    isDisplay: false,
  })
}

export const subscribeComments = (partyId: string, callback: Function) => {
  firestore.collection('comments')
    .where('partyId', '==', partyId)
    .onSnapshot((querySnapshot: any) => {
      return callback(querySnapshotToArray(querySnapshot))
    })
}

export const unsubscibeComments = () => {
  firestore.collection('comments').onSnapshot(() => {})
}

export default {
  addComment,
  findCommentsByPartyId,
  removeComment,
  subscribeComments,
  unsubscibeComments,
}

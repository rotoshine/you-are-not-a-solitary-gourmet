import firestore from './firestore'

const COLLECTION_NAME = 'comments'

const querySnapshotToArray = (querySnapshot: any) => (
  querySnapshot.docs
    .map((doc: any) => ({
      ...doc.data(),
      id: doc.id,
    }))
    .filter((comment: PartyComment) => comment.isDisplay)
    .sort((a: PartyComment, b: PartyComment) => a.createdAt.toDate() > b.createdAt.toDate())
)

export const savePartyComment = async (partyCommentFormData: PartyCommentFormData) => {
  const { id, user } = partyCommentFormData

  if (id) {
    const alreadySavedComment = await firestore.collection(COLLECTION_NAME).doc(id).get()

    if (alreadySavedComment && alreadySavedComment.exists) {
      await firestore.collection(COLLECTION_NAME).doc(id).update({
        ...partyCommentFormData,
        isEdited: true,
        updatedAt: new Date(),
      })
    }

  } else {
    await firestore.collection(COLLECTION_NAME).add({
      ...partyCommentFormData,
      isDisplay: true,
      createdBy: user.email,
      createdAt: new Date(),
    })
  }
}

export const findCommentsByPartyId = async (partyId: string) => {
  const querySnapshot = await firestore
    .collection(COLLECTION_NAME)
    .where('partyId', '==', partyId)
    .get()

  if (querySnapshot) {
    return querySnapshotToArray(querySnapshot)
  }
}

export const removePartyComment = async (commentId: string) => {
  await firestore.collection(COLLECTION_NAME).doc(commentId).update({
    isDisplay: false,
  })
}

export const subscribeComments = (partyId: string, callback: Function) => {
  firestore.collection(COLLECTION_NAME)
    .where('partyId', '==', partyId)
    .where('isDisplay', '==', true)
    .onSnapshot((querySnapshot: any) => {
      return callback(querySnapshotToArray(querySnapshot))
    })
}

export const unsubscibeComments = () => {
  firestore.collection(COLLECTION_NAME).onSnapshot(() => { })
}

export default {
  savePartyComment,
  findCommentsByPartyId,
  removePartyComment,
  subscribeComments,
  unsubscibeComments,
}

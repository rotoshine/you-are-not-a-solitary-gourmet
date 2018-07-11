import db from './firestore'

const COLLECTION_NAME = 'destinations'

export const saveDestination = async (destinationName) => {
  try {
    const alreadyStoredDestination = await db.collection(COLLECTION_NAME).doc(destinationName).get()

    const partyCreatedCount = alreadyStoredDestination.exists ? alreadyStoredDestination.data().partyCreatedCount + 1 : 1

    await db.collection(COLLECTION_NAME).doc(destinationName).set({
      partyCreatedCount
    })
  } catch (e) {
    console.log(e)
  }
}

export const subscribeDestinations = (callback) => {
  db.collection(COLLECTION_NAME)
    .onSnapshot((querySnapshot) => {
      callback(querySnapshot.docs.map((queryData) => (
        {
          id: queryData.id,
          ...queryData.data(),
        }
      )))
    })
}

export const unsubscribeDestinations = () => {
  return db.collection(COLLECTION_NAME).onSnapshot(function () { })
}

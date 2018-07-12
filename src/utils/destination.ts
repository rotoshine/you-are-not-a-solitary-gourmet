import firestore from './firestore'

const COLLECTION_NAME = 'destinations'

const getPartyCreadtedCount = (querySnapshot: any): number => {
  if (querySnapshot && querySnapshot.exists && querySnapshot.data()) {
    return querySnapshot.data().partyCreatedCount + 1
  }

  return 1
}

export const saveDestination = async (destinationName: string) => {
  try {
    const alreadyStoredDestination = await firestore
      .collection(COLLECTION_NAME)
      .doc(destinationName)
      .get()

    const partyCreatedCount = getPartyCreadtedCount(alreadyStoredDestination)

    await firestore.collection(COLLECTION_NAME).doc(destinationName).set({
      partyCreatedCount,
    })
  } catch (e) {
    console.log(e)
  }
}

export const subscribeDestinations = (callback: Function): void => {
  firestore.collection(COLLECTION_NAME)
    .onSnapshot((querySnapshot: any) => {
      callback(
        querySnapshot.docs.map(
          (queryData: any) => ({
            id: queryData.id,
            ...queryData.data(),
          }),
        ),
      )
    })
}

export const unsubscribeDestinations = () => {
  return firestore.collection(COLLECTION_NAME).onSnapshot(() => {})
}

const { firebase } = window

const db = firebase.firestore()

export const addParty = async (party) => {
  console.log(party, db.collection('parties'))
  const { category, title, destinationName, partyTime, description } = party
  const addedParty = await db.collection('parties').add({
    category,
    title,
    destinationName,
    partyTime: new Date(partyTime).getTime(),
    description
  })

  return addedParty
}

export const findTodayParties = async() => {
  const querySnapshot = await db.collection('parties').get()

  if (querySnapshot) {
    return querySnapshot.docs.map((doc) => doc.data())
  }
}

export default {
  addParty,
  findTodayParties
}
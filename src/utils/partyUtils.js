const { firebase } = window

const db = firebase.firestore()

export const addParty = async (party) => {
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
    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id
    }))
  }
}

export const partyJoin = async(partyId, email) => {
   const querySnapshot = await db.collection('parties').doc(partyId).get()

   const party = querySnapshot.data()

   let updateParty = null
   if (!party.joinner) {
      updateParty = {
        ...party,
        joinner: [ email ]
      }
   } else if(!party.joinner.includes(email)) {
      updateParty = {
        ...party,
       joinner: [
         ...party.joinner,
         email
       ]
     }
   }

   if (updateParty) {
    await db.collection('parties').doc(partyId).set(updateParty)
   }
}

export default {
  addParty,
  partyJoin,
  findTodayParties
}
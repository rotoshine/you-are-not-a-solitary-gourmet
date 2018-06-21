const { firebase } = window

const db = firebase.firestore()

export const addParty = async (party) => {
  const { 
    category, 
    title, 
    destinationName, 
    partyTime, 
    dueDateTime,
    description,
    isDelivery,
    maxPartyMember = 0
  } = party

  const addedParty = await db.collection('parties').add({
    category,
    title,
    destinationName,
    partyTime: new Date(partyTime).getTime(),
    dueDateTime: new Date(dueDateTime),
    description,
    isDelivery,
    maxPartyMember
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

export const partyJoin = async(partyId, userId) => {
   const querySnapshot = await db.collection('parties').doc(partyId).get()

   const party = querySnapshot.data()

   let updateParty = null
   if (!party.joinner) {
      updateParty = {
        ...party,
        joinner: [ userId ]
      }
   } else if(!party.joinner.includes(userId)) {
      updateParty = {
        ...party,
       joinner: [
         ...party.joinner,
         userId
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
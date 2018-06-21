import Promise from 'bluebird'
import { findByEmails } from './userUtils'

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

export const findTodayParties = async () => {
  const querySnapshot = await db.collection('parties').get()

  if (querySnapshot) {
    const parties = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id
    }))

    return await Promise.map(parties, async(party) => {
      const joinners = await findByEmails(party.joinners)

      return {
        ...party,
        joinners
      }
    })
  }

  return []
}

export const joinParty = async (partyId, email) => {
  console.log(partyId, email)
  const querySnapshot = await db.collection('parties').doc(partyId).get()

  const party = querySnapshot.data()

  console.log(party)

  let updateParty = null
  if (!party.joinners || party.joinners.length === 0) {
    updateParty = {
      ...party,
      joinners: [email]
    }
  } else if (!party.joinners.includes(email)) {
    updateParty = {
      ...party,
      joinners: [
        ...party.joinners,
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
  joinParty,
  findTodayParties
}
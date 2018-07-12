import Promise from 'bluebird'
import db from './firestore'
import { findByEmails } from './userUtils'
import { isValidSlackHook, notifyToSlack } from './slack'
import { saveDestination } from './destination'

const querySnapshotToArray = async (querySnapshot) => {
  const parties = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id
  }))

  return await Promise.map(parties, async (party) => {
    const joinners = await findByEmails(party.joinners)

    return {
      ...party,
      joinners
    }
  })
}
export const findById = async (partyId) => {
  const querySnapshot = await db.collection('parties').doc(partyId).get()
  return querySnapshot.data()
}

export const saveParty = async (party, user) => {
  const {
    category,
    title,
    destinationName,
    partyTime,
    dueDateTime,
    description,
    isDelivery,
    maxPartyMember = 0,
    joinners = []
  } = party

  const savedParty = await db.collection('parties').add({
    category,
    title,
    destinationName,
    partyTime: new Date(partyTime),
    dueDateTime: new Date(dueDateTime),
    description,
    isDelivery,
    maxPartyMember,
    joinners,
    createdBy: user.email,
    createdAt: new Date()
  })

  if (isValidSlackHook()) {
    await notifyToSlack(`${title} 파티가 만들어졌어요! 파티 장소는 ${destinationName} 입니다!`)
  }

  await saveDestination(destinationName)
  
  return savedParty
}

export const subscribeTodayParties = (callback) => {
  db.collection('parties').where('partyTime', '>', new Date())
    .onSnapshot(async (querySnapshot) => {
      callback(await querySnapshotToArray(querySnapshot))
    })
}

export const unsubscribeTodayParties = () => {
  return db.collection('parties').onSnapshot(function () { })
}

export const findTodayParties = async () => {
  const querySnapshot = await db.collection('parties').where('partyTime', '>', new Date()).get()

  if (querySnapshot) {
    return await querySnapshotToArray(querySnapshot)
  }

  return []
}

export const joinParty = async (partyId, email) => {
  const party = await findById(partyId)

  let updateParty = null
  if (!party.joinners || party.joinners.length === 0) {
    updateParty = {
      joinners: [email]
    }
  } else if (!party.joinners.includes(email)) {
    updateParty = {
      joinners: [
        ...party.joinners,
        email
      ]
    }
  }

  if (updateParty) {
    await db.collection('parties').doc(partyId).update(updateParty)
  }
}

export const leaveParty = async (partyId, email) => {
  const party = await findById(partyId)
  const { joinners } = party

  if (joinners && joinners.length > 0 && joinners.includes(email)) {
    joinners.splice(joinners.indexOf(email), 1)

    await db.collection('parties').doc(partyId).set(party)
  }
}

export default {
  saveParty,
  joinParty,
  leaveParty,
  findTodayParties,
  subscribeTodayParties,
  unsubscribeTodayParties
}
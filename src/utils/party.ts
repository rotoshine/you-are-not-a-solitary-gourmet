import * as Bluebird from 'bluebird'
import firestore from './firestore'
import { findByEmails } from './user'
import { isValidSlackHook, notifyToSlack } from './slack'
import { saveDestination } from './destination'

const querySnapshotToArray = async (querySnapshot: any) => {
  const parties = querySnapshot.docs.map((doc: any) => ({
    ...doc.data(),
    id: doc.id,
  }))

  return await Bluebird.map(parties, async (party: Party) => {
    const joinners = await findByEmails(party.joinners)

    return {
      ...party,
      joinners,
    }
  })
}
export const findById = async (partyId: string): Promise<Party | null> => {
  const querySnapshot = await firestore.collection('parties').doc(partyId).get()
  return <Party>querySnapshot.data()
}

export const saveParty = async (party: Party, user: User) => {
  const {
    category,
    title,
    destinationName,
    partyTime,
    dueDateTime,
    description,
    isDelivery,
    maxPartyMember = 0,
    joinners = [],
  } = party

  const savedParty = await firestore.collection('parties').add({
    description,
    isDelivery,
    maxPartyMember,
    joinners,
    category,
    title,
    destinationName,
    partyTime: new Date(partyTime),
    dueDateTime: new Date(dueDateTime),
    createdBy: user.email,
    createdAt: new Date(),
  })

  if (isValidSlackHook()) {
    await notifyToSlack(`${title} 파티가 만들어졌어요! 파티 장소는 ${destinationName} 입니다!`)
  }

  await saveDestination(destinationName)

  return savedParty
}

export const subscribeTodayParties = (callback: Function) => {
  firestore.collection('parties').where('partyTime', '>', new Date())
    .onSnapshot(async (querySnapshot: any) => {
      callback(await querySnapshotToArray(querySnapshot))
    })
}

export const unsubscribeTodayParties = () => {
  return firestore.collection('parties').onSnapshot(() => { })
}

export const findTodayParties = async () => {
  const querySnapshot = await firestore
    .collection('parties')
    .where('partyTime', '>', new Date())
    .get()

  if (querySnapshot) {
    return await querySnapshotToArray(querySnapshot)
  }

  return []
}

export const joinParty = async (partyId: string, email: string) => {
  const party = await findById(partyId)

  if (party) {
    let updateParty = null
    if (!party.joinners || party.joinners.length === 0) {
      updateParty = {
        joinners: [email],
      }
    } else if (!party.joinners.includes(email)) {
      updateParty = {
        joinners: [
          ...party.joinners,
          email,
        ],
      }
    }

    if (updateParty) {
      await firestore.collection('parties').doc(partyId).update(updateParty)
    }
  }
}

export const leaveParty = async (partyId: string, email: string) => {
  const party = await findById(partyId)

  if (party) {
    const { joinners } = party

    if (joinners && joinners.length > 0 && joinners.includes(email)) {
      joinners.splice(joinners.indexOf(email), 1)

      await firestore.collection('parties').doc(partyId).set(party)
    }
  }
}

export default {
  saveParty,
  joinParty,
  leaveParty,
  findTodayParties,
  subscribeTodayParties,
  unsubscribeTodayParties,
}

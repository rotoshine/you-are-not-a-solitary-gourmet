import * as Bluebird from 'bluebird'
import * as moment from 'moment'

import firestore from './firestore'
import { findByEmails } from './user'
import { isValidSlackHook, notifyToSlack } from './slack'
import { saveDestination } from './destination'

const COLLECTION_NAME = 'parties'

const querySnapshotToArray = async (querySnapshot: any) => {
  const parties = querySnapshot.docs.map((doc: any) => ({
    ...doc.data(),
    id: doc.id,
  }))

  return await Bluebird.map(parties, async (party: Party) => {
    const fetchedJoinners = await findByEmails(party.joinners)

    return {
      ...party,
      fetchedJoinners,
    }
  })
}

export const findById = async (partyId: string): Promise<Party | null> => {
  const querySnapshot = await firestore.collection(COLLECTION_NAME).doc(partyId).get()
  return {
    ...<Party>querySnapshot.data(),
    id: querySnapshot.id,
  }
}

export const saveParty = async (partyForm: PartyFormData, user: User) => {
  const {
    category,
    title,
    destinationName,
    partyTimeDate,
    dueDateTimeDate,
    description,
    isDelivery,
    maxPartyMember = 0,
    joinners = [],
  } = partyForm

  const saveOrUpdatePartyForm = {
    description,
    isDelivery,
    maxPartyMember,
    joinners,
    category,
    title,
    destinationName,
    partyTime: new Date(partyTimeDate),
    dueDateTime: new Date(dueDateTimeDate),
    createdBy: user.email,
    createdAt: new Date(),
  }

  if (partyForm.id) {
    const alreadySavedParty = await firestore.collection(COLLECTION_NAME).doc(partyForm.id).get()

    if (alreadySavedParty && alreadySavedParty.exists) {
      await firestore.collection(COLLECTION_NAME).doc(partyForm.id).update(saveOrUpdatePartyForm)
      const notifyTexts = [
        `\`[${category}]\` \`${title}\` 파티가 만들어졌어요!`,
        `${window.location.origin}/parties/${partyForm.id}`,
      ]
      if (isValidSlackHook()) {
        await notifyToSlack(notifyTexts.join('\n'))
      }
    }

  } else {
    const newPartyRef = await firestore.collection(COLLECTION_NAME).add(saveOrUpdatePartyForm)

    if (isValidSlackHook()) {
      const notifyTexts = [
        `\`[${category}]\` \`${title}\` 파티가 만들어졌어요!`,
        `${window.location.origin}/parties/${newPartyRef.id}`,
        `파티 마감 시간은 \`${moment(dueDateTimeDate).format('YYYY-MM-DD HH:mm')}\`까지 입니다.`,
      ]
      await notifyToSlack(notifyTexts.join('\n'))
    }

    await saveDestination(destinationName)
  }
}

const createTodayPartiesQuery = () => firestore
  .collection('parties')
  .where('partyTime', '>', new Date())
  .orderBy('partyTime', 'asc')
  .limit(100)

const retrieveTime = (now = new Date().getTime()) => (party: any): number => {
  if (party.dueDateTime.seconds * 1000 < now) return -Infinity
  return Math.abs(now - party.partyTime.seconds)
}

export const subscribeTodayParties = (callback: Function) => {
  createTodayPartiesQuery()
    .onSnapshot(async (querySnapshot: any) => {
      const data = await querySnapshotToArray(querySnapshot)
      const retrieve = retrieveTime()
      const sorted = data.sort((a: any, b: any) => retrieve(b) - retrieve(a))
      callback(sorted)
    })
}

export const unsubscribeTodayParties = () => {
  return firestore.collection('parties').onSnapshot(() => { })
}

export const findTodayParties = async () => {
  const querySnapshot = await createTodayPartiesQuery()
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

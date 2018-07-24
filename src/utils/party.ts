import * as Bluebird from 'bluebird'

import firestore from './firestore'
import { findByEmails } from './user'
import { isValidSlackHook, notifyToSlack } from './slack'
import { saveDestination } from './destination'

const COLLECTION_NAME = 'parties'

const sendSlackNotifyMessage = async (
  category: Category,
  isNew: boolean,
  partyTitle: string,
  partyId: string) => {
  if (isValidSlackHook()) {
    const texts = [
      `\`[${category.name}]\` \`${partyTitle}\` 파티가 ${isNew ? '만들어졌어요!' : '수정되었어요!'}`,
      `${window.location.origin}/parties/${partyId}`,
    ]

    await notifyToSlack(texts.join('\n'))
  }
}

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
    playName,
    maxPartyMember = 0,
    joinners = [],
  } = partyForm

  const saveOrUpdatePartyForm = {
    description,
    maxPartyMember,
    category,
    title,
    destinationName,
    playName,
    partyTime: new Date(partyTimeDate),
    dueDateTime: dueDateTimeDate ? new Date(dueDateTimeDate) : null,
    createdBy: user.email,
  }

  if (partyForm.id) {
    const alreadySavedParty = await firestore.collection(COLLECTION_NAME).doc(partyForm.id).get()

    if (alreadySavedParty && alreadySavedParty.exists) {
      await firestore.collection(COLLECTION_NAME).doc(partyForm.id).update({
        ...saveOrUpdatePartyForm,
        updatedAt: new Date(),
      })

      // await sendSlackNotifyMessage(category, false, title, partyForm.id)
    }

  } else {
    const newPartyRef = await firestore.collection(COLLECTION_NAME).add({
      ...saveOrUpdatePartyForm,
      joinners,
      createdAt: new Date(),
    })

    await sendSlackNotifyMessage(category, true, title, newPartyRef.id)
    await saveDestination(destinationName, {
      isDeliverable: category.isDeliverable,
      isRestaurant: category.isRestaurant,
      isPlaying: category.isPlaying,
      isTravel: category.isTravel,
      hasDueDateTime: category.hasDueDateTime,
    })

    if (category.isPlaying && playName && playName.length > 0) {
      await saveDestination(playName, {
        isDeliverable: false,
        isRestaurant: false,
        isTravel: false,
        isPlaying: true,
      })
    }
  }
}

const createTodayPartiesQuery = () => firestore
  .collection('parties')
  .where('partyTime', '>', new Date())
  .orderBy('partyTime', 'asc')

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

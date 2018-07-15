declare type User = {
  displayName: string,
  photoURL: string,
  email: string,
}

type FirestoreDateType = {
  toDate: Function
}

declare type PartyCommonProps = {
  category: string,
  title: string,
  description: string,
  destinationName: string,
  isDelivery: boolean,
  dueDateTime: FirestoreDateType,
  maxPartyMember: number,
  partyTime: FirestoreDateType,
  joinners: string[],
  fetchedJoinners?: User[],
  createdBy: string,
}

declare type Party = PartyCommonProps & {
  dueDateTime: FirestoreDateType,
  partyTime: FirestoreDateType,
  fetchedJoinners: User[],  
}

declare type PartyForm = PartyCommonProps & {
  id?: string,
  joinners: string[],
  partyTimeDate: Date,
  dueDateTimeDate: Date,
  createdAt: Date,
}

declare type Destination = {
  id: string,
  partyCreatedCount: number,
}

declare type PartyComment = {
  partyId: string,
  content: string,
  isDisplay: boolean,
  user: User,
  createdAt: {
    toDate: Function,
  },
  createdBy: string,
}

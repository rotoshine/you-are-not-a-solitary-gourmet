declare type User = {
  displayName: string,
  photoURL: string,
  email: string,
}

type FirestoreDateType = {
  toDate: () => Date,
}

declare type PartyCommonProps = {
  id?: string,
  category: string,
  title: string,
  description: string,
  destinationName: string,
  isDelivery: boolean,  
  maxPartyMember: number,  
  joinners: string[],
  createdBy: string,
}

declare type Party = PartyCommonProps & {
  dueDateTime: FirestoreDateType,
  partyTime: FirestoreDateType,
  fetchedJoinners?: User[],  
}

declare type PartyFormData = PartyCommonProps & {   
  partyTimeDate: Date,
  dueDateTimeDate: Date,
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

declare type User = {
  displayName: string,
  photoURL: string,
  email: string,
}

declare type Party = {
  category: string,
  title: string,
  description: string,
  destinationName: string,
  isDelivery: boolean,
  dueDateTime: string,
  maxPartyMember: number,
  partyTime: Date,
  joinners: string[], 
  createdAt: Date,
  createdBy: string,
  
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

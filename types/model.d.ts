declare interface User {
  displayName: string
  photoURL: string
  email: string
}

type FirestoreDateType = {
  toDate: () => Date,
}

type FirestoreTimestamp = {
  seconds: number,
  nanoseconds: number,
}

declare interface PartyCommonProps {
  id?: string
  category: Category
  title: string
  description: string
  destinationName: string
  playName: string
  isDelivery: boolean
  maxPartyMember: number
  joinners: string[]
  createdBy: string
  createdAt: FirestoreTimestamp
}

declare interface Party extends PartyCommonProps {
  dueDateTime: FirestoreDateType
  partyTime: FirestoreDateType
  fetchedJoinners?: User[]
}

declare interface PartyFormData extends PartyCommonProps {
  partyTimeDate: Date
  dueDateTimeDate: Date
}

declare interface CategoryMeta {
  isRestaurant: boolean
  isDeliverable: boolean
  isTravel: boolean
  isPlaying: boolean
}

declare interface Destination extends CategoryMeta {
  id: string
  partyCreatedCount: number
}

declare interface PartyComment {
  id: string
  partyId: string
  content: string
  isDisplay: boolean
  user: User
  createdAt: {
    toDate: Function
  }
  createdBy: string
}

declare interface Category extends CategoryMeta {
  id: string,
  name: string
}

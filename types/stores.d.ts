declare interface IPartyStore {
  initialized: boolean
  parties: Party[]
  initializeParties(): void
}

declare interface IUserStore {
  user: User | null
  initializeUser(): void
  isExistUser(): boolean
  signOut(): void
}

declare interface IDestinationsStore {
  destinations: Destination[] | null
  initializeDestinations(): void
}
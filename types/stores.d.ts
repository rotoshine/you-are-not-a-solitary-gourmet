declare interface IAllStore {
  userStore: IUserStore,
  partyStore: IPartyStore,
  destinationsStore: IDestinationsStore
}

declare interface IPartyStore {
  initializedParty: boolean
  parties: Party[] | null
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
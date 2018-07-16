declare interface IRootStore {
  userStore: IUserStore,
  partyStore: IPartyStore,
  destinationsStore: IDestinationsStore
}

declare interface IPartyStore {
  initializedParty: boolean
  parties: Party[] | null
  myCreatedParties: Party[] | null
  myCreatedPartiesFetchStatus: string
  initializeParties(): void
  fetchMyCreatedParties(email: string): Promise<void>

}

declare interface IUserStore {
  user: User | null
  isExistUser: boolean
  initializeUser(): void
  signOut(): void
}

declare interface IDestinationsStore {
  destinations: Destination[] | null
  initializeDestinations(): void
}
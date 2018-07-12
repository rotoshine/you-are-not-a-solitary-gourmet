declare interface IPartyStore {
  parties: Party[]
  initializeParties(): void
}

declare interface IUserStore {
  user: User
  initializeUser(): void
  isExistUser(): boolean
  signOut(): void
}

declare interface IDestinationsStore {
  destinations: Destination[]
  initializeDestinations(): void
}
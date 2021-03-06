export default [
  {
    id: 'MEAL_LUNCH',
    name: '점심식사',    
    isDeliverable: false,
    isRestaurant: true,
    isPlaying: false,
    isTravel: false,
    hasDueDateTime: false,
    emoji: '🍱',
  },
  {
    id: 'MEAL_LUNCH_DELIVERY',
    name: '점심식사 - 배달',
    isDeliverable: true,
    isRestaurant: true,
    isPlaying: false,
    isTravel: false,
    hasDueDateTime: true,
    emoji: '🏍🍱',
  },
  {
    id: 'MEAL_DINNER',
    name: '저녁식사',
    isDeliverable: false,
    isRestaurant: true,
    isPlaying: false,
    isTravel: false,
    hasDueDateTime: false,
    emoji: '🥘',
  },
  {
    id: 'MEAL_DINNER_DELIVERY',
    name: '저녁식사 - 배달',
    isDeliverable: true,
    isRestaurant: true,
    isPlaying: false,
    isTravel: false,
    hasDueDateTime: true,
    emoji: '🏍🥘',
  },
  {
    id: 'SNACK',
    name: '간식',
    isDeliverable: false,
    isRestaurant: true,
    isPlaying: false,
    isTravel: false,
    hasDueDateTime: false,
    emoji: '☕',
  },
  {
    id: 'MEAL_AFTER_GAME',
    name: '밥 시켜먹고 게임하기',
    isDeliverable: true,
    isRestaurant: true,
    isPlaying: true,
    isTravel: false,
    hasDueDateTime: true,
    emoji: '🏍🍱 ➡ 🎮',
  },
  {
    id: 'TRAVEL',
    name: '여행',
    isDeliverable: false,
    isRestaurant: false,
    isPlaying: false,
    isTravel: true,
    hasDueDateTime: true,
    emoji: '🏖',
  },
  {
    id: 'PLAY',
    name: '놀이',
    isDeliverable: false,
    isRestaurant: false,
    isPlaying: true,
    isTravel: false,
    hasDueDateTime: false,
    emoji: '🏄',
  },
]

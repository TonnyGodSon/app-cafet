export interface Dish {
  id: string;
  name: string;
  image: string;
}

export interface Drink {
  id: string;
  name: string;
  image: string;
}

export interface Dessert {
  id: string;
  name: string;
  image: string;
}

export const MOCK_DISHES: Dish[] = [
  { id: '1', name: 'Poisson Attiéké', image: 'assets/dishes/poisson.svg' },
  { id: '2', name: 'Poulet Pommes de terre', image: 'assets/dishes/poulet.svg' },
  { id: '3', name: 'Viande hachée Riz', image: 'assets/dishes/viande.svg' }
];

export const MOCK_DRINKS: Drink[] = [
  { id: '1', name: 'Coca-Cola', image: 'assets/drinks/coca.svg' },
  { id: '2', name: 'Orangina', image: 'assets/drinks/orangina.svg' },
  { id: '3', name: 'Oasis', image: 'assets/drinks/oasis.svg' },
  { id: '4', name: 'Bissap', image: 'assets/drinks/bissap.svg' },
  { id: '5', name: 'Jus de gingembre', image: 'assets/drinks/gingembre.svg' }
];

export const MOCK_DESSERTS: Dessert[] = [
  { id: '1', name: 'Déguê', image: 'assets/desserts/degue.svg' },
  { id: '2', name: 'Cookies', image: 'assets/desserts/cookies.svg' },
  { id: '3', name: 'Gâteau', image: 'assets/desserts/gateau.svg' }
];

export interface User {
  id: string;
  firstName: string;
  phoneNumber: string;
}

export const MOCK_USERS: User[] = [
  {
    id: '1',
    firstName: 'Mistura',
    phoneNumber: '0758297734'
  },
  {
    id: '2',
    firstName: 'Kaissy',
    phoneNumber: '0780862724'
  },
  {
    id: '3',
    firstName: 'Antoine',
    phoneNumber: '0767292866'
  }
];

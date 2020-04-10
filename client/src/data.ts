export const teams = [
  {
    avatar:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/The_Boring_Company_Logo.svg/200px-The_Boring_Company_Logo.svg.png',
    name: 'The Boring Company',
    users: [],
  },
  {
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/8/85/3M_CORPORATION.png',
    name: '3M',
    users: [],
  },
  {
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/200px-NASA_logo.svg.png',
    name: 'NASA',
    users: [],
  },
] as const;

export type Team = typeof teams[0] | typeof teams[1] | typeof teams[2];

export enum UserStatus {
  CONNECTED,
  AVAILABLE,
  UNAVAILABLE,
}

export type User = {
  id: string;
  name: string;
  avatar: string;
};

export type Team = { name: string; avatar: string; users: User[] };

export const teams: Team[] = [
  {
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/8/85/3M_CORPORATION.png',
    name: '3M',
    users: [
      {
        id: '1',
        name: 'Elon Musk',
        avatar: 'https://i1.sndcdn.com/avatars-000343928089-mj2j87-t500x500.jpg',
      },
      {
        id: '2',
        name: 'Kim Collins',
        avatar: 'https://randomuser.me/api/portraits/women/37.jpg',
      },
      {
        id: '3',
        name: 'Joseph Arnold',
        avatar: 'https://randomuser.me/api/portraits/men/98.jpg',
      },
      {
        id: '4',
        name: 'Carolyn Frazier',
        avatar: 'https://randomuser.me/api/portraits/women/7.jpg',
      },
      {
        id: '5',
        name: 'Yoda',
        avatar: 'https://avatarfiles.alphacoders.com/125/125043.jpg',
      },
      {
        id: '5',
        name: 'Pat Burns',
        avatar: 'https://randomuser.me/api/portraits/men/50.jpg',
      },
      {
        id: '6',
        name: 'Martha Johnston',
        avatar: 'https://randomuser.me/api/portraits/women/92.jpg',
      },
      {
        id: '7',
        name: 'Lee Marshall',
        avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
      },
      {
        id: '8',
        name: 'Ricky Murphy',
        avatar: 'https://randomuser.me/api/portraits/men/40.jpg',
      },
      {
        id: '9',
        name: 'Dustin Diaz',
        avatar: 'https://randomuser.me/api/portraits/men/49.jpg',
      },
      {
        id: '10',
        name: 'Melinda Rivera',
        avatar: 'https://randomuser.me/api/portraits/women/75.jpg',
      },
      {
        id: '11',
        name: 'Floyd White',
        avatar: 'https://randomuser.me/api/portraits/men/80.jpg',
      },
      {
        id: '12',
        name: 'Deanna Jones',
        avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
      },
      {
        id: '13',
        name: 'Isaac Howell',
        avatar: 'https://randomuser.me/api/portraits/men/25.jpg',
      },
      {
        id: '14',
        name: 'Dustin Watts',
        avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      },
      {
        id: '15',
        name: 'Grace Foster',
        avatar: 'https://randomuser.me/api/portraits/women/73.jpg',
      },
      {
        id: '16',
        name: 'Brittany Price',
        avatar: 'https://randomuser.me/api/portraits/women/18.jpg',
      },
      {
        id: '17',
        name: 'Riley Pierce',
        avatar: 'https://randomuser.me/api/portraits/women/11.jpg',
      },
      {
        id: '18',
        name: 'Warren Johnston',
        avatar: 'https://randomuser.me/api/portraits/men/36.jpg',
      },
      {
        id: '19',
        name: 'Wesley Silva',
        avatar: 'https://randomuser.me/api/portraits/men/21.jpg',
      },
    ],
  },
  {
    avatar:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/The_Boring_Company_Logo.svg/200px-The_Boring_Company_Logo.svg.png',
    name: 'The Boring Company',
    users: [
      {
        id: '1',
        name: 'Elon Musk',
        avatar: 'https://i1.sndcdn.com/avatars-000343928089-mj2j87-t500x500.jpg',
      },
      {
        id: '2',
        name: 'Kim Collins',
        avatar: 'https://randomuser.me/api/portraits/women/37.jpg',
      },
      {
        id: '3',
        name: 'Joseph Arnold',
        avatar: 'https://randomuser.me/api/portraits/men/98.jpg',
      },
      {
        id: '4',
        name: 'Carolyn Frazier',
        avatar: 'https://randomuser.me/api/portraits/women/7.jpg',
      },
      {
        id: '5',
        name: 'Yoda',
        avatar: 'https://avatarfiles.alphacoders.com/125/125043.jpg',
      },
    ],
  },
  {
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/200px-NASA_logo.svg.png',
    name: 'NASA',
    users: [],
  },
];

export enum UserStatus {
  CONNECTED,
  AVAILABLE,
  UNAVAILABLE,
}

export type User = { name: string; avatar: string; status: UserStatus };

export type Team = { name: string; avatar: string; users: User[] };

export const teams = [
  {
    avatar:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/The_Boring_Company_Logo.svg/200px-The_Boring_Company_Logo.svg.png',
    name: 'The Boring Company',
    users: [
      {
        name: 'Elon Musk',
        avatar: 'https://i1.sndcdn.com/avatars-000343928089-mj2j87-t500x500.jpg',
        status: UserStatus.CONNECTED,
      },
      {
        name: 'Kim Collins',
        avatar: 'https://randomuser.me/api/portraits/women/37.jpg',
        status: UserStatus.CONNECTED,
      },
      {
        name: 'Joseph Arnold',
        avatar: 'https://randomuser.me/api/portraits/men/98.jpg',
        status: UserStatus.AVAILABLE,
      },
      {
        name: 'Carolyn Frazier',
        avatar: 'https://randomuser.me/api/portraits/women/7.jpg',
        status: UserStatus.UNAVAILABLE,
      },
    ],
  },
  {
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/8/85/3M_CORPORATION.png',
    name: '3M',
    users: [
      { name: 'Pat Burns', avatar: 'https://randomuser.me/api/portraits/men/50.jpg', status: UserStatus.CONNECTED },
      {
        name: 'Martha Johnston',
        avatar: 'https://randomuser.me/api/portraits/women/92.jpg',
        status: UserStatus.AVAILABLE,
      },
      { name: 'Lee Marshall', avatar: 'https://randomuser.me/api/portraits/men/6.jpg', status: UserStatus.CONNECTED },
      { name: 'Ricky Murphy', avatar: 'https://randomuser.me/api/portraits/men/40.jpg', status: UserStatus.AVAILABLE },
      { name: 'Dustin Diaz', avatar: 'https://randomuser.me/api/portraits/men/49.jpg', status: UserStatus.AVAILABLE },
      {
        name: 'Melinda Rivera',
        avatar: 'https://randomuser.me/api/portraits/women/75.jpg',
        status: UserStatus.CONNECTED,
      },
      { name: 'Floyd White', avatar: 'https://randomuser.me/api/portraits/men/80.jpg', status: UserStatus.UNAVAILABLE },
      {
        name: 'Deanna Jones',
        avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
        status: UserStatus.AVAILABLE,
      },
      {
        name: 'Isaac Howell',
        avatar: 'https://randomuser.me/api/portraits/men/25.jpg',
        status: UserStatus.UNAVAILABLE,
      },
      { name: 'Dustin Watts', avatar: 'https://randomuser.me/api/portraits/men/45.jpg', status: UserStatus.CONNECTED },
      {
        name: 'Grace Foster',
        avatar: 'https://randomuser.me/api/portraits/women/73.jpg',
        status: UserStatus.UNAVAILABLE,
      },
      {
        name: 'Brittany Price',
        avatar: 'https://randomuser.me/api/portraits/women/18.jpg',
        status: UserStatus.CONNECTED,
      },
      {
        name: 'Riley Pierce',
        avatar: 'https://randomuser.me/api/portraits/women/11.jpg',
        status: UserStatus.CONNECTED,
      },
      {
        name: 'Warren Johnston',
        avatar: 'https://randomuser.me/api/portraits/men/36.jpg',
        status: UserStatus.UNAVAILABLE,
      },
      { name: 'Wesley Silva', avatar: 'https://randomuser.me/api/portraits/men/21.jpg', status: UserStatus.AVAILABLE },
    ],
  },
  {
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/200px-NASA_logo.svg.png',
    name: 'NASA',
    users: [],
  },
] as Team[];

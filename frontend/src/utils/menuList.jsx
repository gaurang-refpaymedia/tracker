export const menuList = [
  {
    id: 0,
    name: 'dashboards',
    path: '#',
    icon: 'feather-airplay',
    dropdownMenu: [
      {
        id: 1,
        name: 'CRM',
        path: '/',
        subdropdownMenu: false,
      },
      {
        id: 2,
        name: 'Analytics',
        path: '/dashboards/analytics',
        subdropdownMenu: false,
      },
    ],
  },
  {
    id: 1,
    name: 'Advertisers',
    path: '#',
    icon: 'feather-cast',
    dropdownMenu: [
      {
        id: 1,
        name: 'Advertiser List',
        path: '/advertisers',
        subdropdownMenu: false,
      },
      {
        id: 2,
        name: 'Create Advertiser',
        path: '/advertisers/new',
        subdropdownMenu: false,
      }
    ],
  },
  {
    id: 1,
    name: 'Publishers',
    path: '#',
    icon: 'feather-cast',
    dropdownMenu: [
      {
        id: 1,
        name: 'Publisher List',
        path: '/publishers',
        subdropdownMenu: false,
      },
      {
        id: 2,
        name: 'Create Publisher',
        path: '/publishers/new',
        subdropdownMenu: false,
      }
    ],
  },
];

// Array in order of how they will appear in the menu list
// Each object will be treated differently based on its properties
// as it's iterated through in the AppDrawer component
const Menu = [
  { header: "Apps" },
  {
    title: "Dashboard",
    group: "apps",
    icon: "mdi-home",
    name: "Dashboard"
  },
  { header: "CMS" },
  {
    title: "Bookings",
    name: "Bookings.list",
    icon: "mdi-calendar-check",
  },
  {
    title: "Calendar",
    name: "Calendar",
    icon: "mdi-calendar-today",
  },
  {
    title: "Locations",
    name: "Locations.list",
    icon: "mdi-map-marker",
  },
  {
    title: "Countries",
    name: "Countries.list",
    adminOnly: true,
    icon: "mdi-earth",
  },
  {
    title: "Cities",
    name: "Cities.list",
    adminOnly: true,
    icon: "mdi-city",
  },
  {
    title: "Users",
    name: "Users.list",
    adminOnly: true,
    icon: "mdi-account-multiple",
  },
  { divider: true },
  { header: 'Extras' },
  {
    title: 'Error Pages',
    group: 'extra',
    icon: 'mdi-format-list-bulleted',
    items: [
      { name: '404', title: '404', component: '404', icon: 'mdi-alert-circle', actionClass: 'error--text' },
      { name: '403', title: '403', component: '403', icon: 'mdi-alert-circle', actionClass: 'error--text' },
      { name: '500', title: '500', component: '500', icon: 'mdi-alert-circle', actionClass: 'error--text' }
    ]
  }
];

// reorder menu
Menu.forEach(item => {
  if (item.items) {
    item.items.sort((x, y) => {
      let textA = x.title.toUpperCase()
      let textB = y.title.toUpperCase()
      return textA < textB ? -1 : textA > textB ? 1 : 0
    });
  }
});

export default Menu;
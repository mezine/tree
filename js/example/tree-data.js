var Immutable = require('immutable');

var TreeData = {
  children: [
    {
      label: 'Recipes',
      name: 'recipes',
      children: [
        {
          label: 'Chicken Pot Pie',
          name: 'chicken-pot-pie'
        },
        {
          label: 'Banana Cream Pie',
          name: 'banana-cream-pie'
        },
        {
          label: 'Burgers',
          name: 'burgers',
          children: [
            {
              label: 'Cheeseburger',
              name: 'cheeseburger'
            },
            {
              label: 'Mushroom Burger',
              name: 'mushroom-burger'
            }
          ]
        }
      ]
    },
    {
      label: 'Lists',
      name: 'lists',
      children: [
        {
          label: 'Shopping List',
          name: 'shopping-list'
        },
        {
          label: 'To Do',
          name: 'to-do-list'
        }
      ]
    }
  ],
  collapsed: ['burgers', 'lists']
};

module.exports = TreeData;
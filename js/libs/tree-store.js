var Reflux = require('reflux');
var Immutable = require('immutable');

var Actions = require('./tree-actions');

var RawTreeData = {
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
        },
        {
          label: 'Pizzas',
          name: 'pizzas',
          children: [
            {
              label: 'Pepperoni Pizza',
              name: 'pepproni-pizza'
            },
            {
              label: 'Hawaiian Pizza',
              name: 'hawaiian-pizza'
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
  ]
};

var Data = {
  tree: Immutable.fromJS(RawTreeData)
};

var TreeStore = Reflux.createStore({
  init: function () {
    this.listenTo(Actions.refreshTree, this.refresh);
  },
  get: function () {
    return Data;
  },
  refresh: function () {
    console.log('tree-store#refresh');
  }
});

var This = TreeStore;

module.exports = TreeStore;
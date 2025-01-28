export default {
  'content-api': {
  type: 'content-api',
  routes: [{
      method: 'POST',
      path: '/submit',
      handler: 'submitController.index',
      config: {
        policies: [],
      },
    }],
  },
};

export default {  
  kind: 'collectionType',
  collectionName: 'recipients',
  info: {
    singularName: 'recipient', // kebab-case mandatory
    pluralName: 'recipients', // kebab-case mandatory
    displayName: 'Notification Recipients',
    description: 'List of Notification Recipients'  
  },
  options: {
    draftAndPublish: false,
  },
  pluginOptions: {
    'content-manager': {
      visible: true,
    },
    'content-type-builder': {
      visible: false,
    },
  },
  attributes: {
    name: {
      type: 'string',
      min: 1,
      max: 50,
      configurable: false,
    },
    email: {
      type: 'string',
      min: 1,
      max: 50,
      configurable: false,
    },
    number: {
      type: 'string',
      min: 1,
      max: 50,
      configurable: false,
    },
  },
};

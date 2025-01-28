export default {
  kind: 'collectionType',
  collectionName: 'submissions',
  info: {
    singularName: 'submission', // kebab-case mandatory
    pluralName: 'submissions', // kebab-case mandatory
    displayName: 'Form Submissions',
    description: 'A Place for all your form submissions',
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
    score: {
      type: 'string',
      min: 1,
      max: 50,
      configurable: false,
    },
    formName: {
      type: 'string',
      min: 1,
      max: 50,
      configurable: false,
    },
    data: {
      type: 'json',
      configurable: false,
    },
  },
};

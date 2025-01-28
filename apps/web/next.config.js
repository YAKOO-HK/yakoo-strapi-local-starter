import withNextIntl from 'next-intl/plugin';

export default withNextIntl()({
  poweredByHeader: false,
  logging: {
    fetches: {
      //   fullUrl: true,
    },
  },
});

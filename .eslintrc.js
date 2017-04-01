'use strict';

module.exports = {
  root: true,
  extends: [
    'airbnb-base',
  ],
  rules: {
    'no-param-reassign': [2, { props: false }],
    'import/extensions': 0,
    'import/no-extraneous-dependencies': 0,
    'import/no-unresolved': 0,
  },
};

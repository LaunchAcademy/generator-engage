module.exports = {
  extends: ["airbnb", "prettier"],
  env: {
    jest: true,
    node: true
  },
  rules: {
    "prettier/prettier": "error",
    "no-underscore-dangle": "off",
    "no-param-reassign": ["error", { props: false }],
    "react/jsx-filename-extension": [1, { "extensions": [".js"] }]
  },
  plugins: ["prettier"]
};

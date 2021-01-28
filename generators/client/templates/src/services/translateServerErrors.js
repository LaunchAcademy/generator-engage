import _ from 'lodash'

let translateServerErrors = (errors) => {
  let serializedErrors = {}

  Object.keys(errors).forEach((key) => {
    const messages = errors[key].map((error) => {
      const field = _.startCase(key)
      serializedErrors = {
        ...serializedErrors,
        [field]: error.message
      }
    })
  });
  return serializedErrors
};

export default translateServerErrors;

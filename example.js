const yup = require("yup");
const getErrors = require("./index");

// Setup Yup schema as you normally would
const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email()
    .required(),
  name: yup
    .string()
    .required()
    .min(3),
  password: yup
    .string()
    .required()
    .matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      "Must contain at least 8 characters, one uppercase, one lowercase, one number and a special character"
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords don't match")
    .required()
});

const testData = {
  email: "invalid@email",
  name: ":(",
  password: "Qwertyuiop123!@@!#!@",
  confirmPassword: "poiuytrewq"
};

validationSchema
  .validate(testData, { abortEarly: false })
  .then(() => {
    console.log("Thankfully there are no errors");
  })
  .catch(yupError => {
    console.log(getErrors(yupError));
  });

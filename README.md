# Yup Error To Object

Turn yup errors into a more readable, workable and useful object format, just like it is in [Formik](https://github.com/jaredpalmer/formik)!

## Installing

Just run:

```
npm install yup-to-object
```

or

```
yarn add yup-to-object
```

## Usage

Import yup and yup-to-object

```javascript
import * as yup from "yup";
import yupToObject from "yup-to-object";
```

Setup your Yup schema as you normally would:

```javascript
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
```

Setup some data to validate (this is just an example)

```javascript
const testData = {
  email: "invalid@email",
  name: ":(",
  password: "Qwertyuiop123!@@!#!@",
  confirmPassword: "poiuytrewq"
};
```

Do the validation (make sure to set abortEarly to false if you want all errors)

```javascript
validationSchema
  .validate(testData, { abortEarly: false })
  .then(() => {
    console.log("Thankfully there are no errors");
  })
  .catch(yupError => {
    const errorObject = yupToObject(yupError);

    console.log(errorObject);
  });
```

The result errorObject will look like the one below:

```javascript
errorObject = {
  email: "email must be a valid email",
  name: "name must be at least 3 characters",
  password:
    "Must contain at least 8 characters, one uppercase, one lowercase, one number and a special character",
  confirmPassword: "Passwords don't match"
};
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

This code is mostly taken directly from formik project, i just made it standalone.

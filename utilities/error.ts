import { Result, ValidationError } from "express-validator";

function validateError(error: Result<ValidationError>) {
  let errors: Array<string> = [];
  error.array().forEach((v, i) => {
    if (v.msg != "Invalid value") {
      errors.push(v.msg);
    }
  });

  return errors[0];
}

export { validateError };

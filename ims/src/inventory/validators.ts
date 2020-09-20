import { Errors } from './errors';

export function incorrectFieldSize(field: string, min: number, max: number): boolean {
  if (!field) {
    return true;
  }
  const property = field.trim();
  return property.length < min || property.length > max;
}

export function incorrectNumeric(field: any): boolean {
  if (!field) {
    return true;
  }

  if (Number.isNaN(field)) {
    return true;
  }

  if (Number(field) < 0) {
    return true;
  }

  return false;
}

export function getMessage(userFriendlyName: string, min: number, max: number): Error {
  const msg = `${userFriendlyName} should have a minimum length of ${min} and maximum length of ${max}.`;
  const err: Error = new Error(msg);
  err.name = Errors.InvalidAttributeError;
  return err;
}

export function getMissingAttributeMessage(userFriendlyName: string): Error {
  const msg = `${userFriendlyName} is a mandatory attribute and is missing.`;
  const err: Error = new Error(msg);
  err.name = Errors.InvalidAttributeError;
  return err;
}

export function getNumericTypeMessage(userFriendlyName: string): Error {
  const msg = `${userFriendlyName} should have a valid non-negative numeric value.`;
  const err: Error = new Error(msg);
  err.name = Errors.InvalidAttributeError;
  return err;
}

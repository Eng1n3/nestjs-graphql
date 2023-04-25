/* eslint-disable @typescript-eslint/ban-types */
import { ValidationOptions, registerDecorator } from 'class-validator';

export function IsWordStrict(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsWordStrict',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        message:
          "Input dengan format 'Ini kata' ['tanpa spasi di awal kata', 'tanpa spasi di setelah kata jika tidak ada huruf setelahnya']",
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          const regex = /^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$/;
          console.log(regex.test(value), 19);
          return typeof value === 'string' && regex.test(value);
        },
      },
    });
  };
}

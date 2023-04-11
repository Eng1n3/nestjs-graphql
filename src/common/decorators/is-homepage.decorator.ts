/* eslint-disable @typescript-eslint/ban-types */
import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsHomepage(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsHomepage',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        message: "Input dengan format 'http://domain.com/home'",
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          const regex =
            /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
          return typeof value === 'string' && regex.test(value);
        },
      },
    });
  };
}

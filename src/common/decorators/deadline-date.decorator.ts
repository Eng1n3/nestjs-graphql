/* eslint-disable @typescript-eslint/ban-types */
import { registerDecorator, ValidationOptions } from 'class-validator';

export function DeadlineDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsOnlyDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        message: 'Deadline tidak boleh dibawah waktu sekarang',
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          return new Date(value).getDate() >= new Date().getDate();
        },
      },
    });
  };
}

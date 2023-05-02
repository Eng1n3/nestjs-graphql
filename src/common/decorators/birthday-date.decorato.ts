/* eslint-disable @typescript-eslint/ban-types */
import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsBirthdayDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsBirthdayDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        message: 'tanggal lahir tidak boleh diatas waktu sekarang',
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          return new Date(value).getTime() <= new Date().getTime();
        },
      },
    });
  };
}

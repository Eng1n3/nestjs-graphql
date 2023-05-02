/* eslint-disable @typescript-eslint/ban-types */
import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsDeadlineDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsDeadlineDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        message: 'tanggal deadline tidak boleh dibawah waktu sekarang',
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          return new Date(value).getTime() >= new Date().getTime();
        },
      },
    });
  };
}

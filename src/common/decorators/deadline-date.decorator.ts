/* eslint-disable @typescript-eslint/ban-types */
import { registerDecorator, ValidationOptions } from 'class-validator';
import * as moment from 'moment';

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
          return moment(value).valueOf() >= moment().startOf('day').valueOf();
        },
      },
    });
  };
}

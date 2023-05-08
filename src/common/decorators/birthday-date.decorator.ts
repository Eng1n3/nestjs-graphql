/* eslint-disable @typescript-eslint/ban-types */
import { registerDecorator, ValidationOptions } from 'class-validator';
import * as moment from 'moment';

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
          return moment(value).valueOf() <= moment().startOf('day').valueOf();
        },
      },
    });
  };
}

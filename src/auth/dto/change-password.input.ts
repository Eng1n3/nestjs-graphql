import { InputType, PickType } from '@nestjs/graphql';
import { RegisterUserInput } from './register.input';

@InputType()
export class ChangePasswordInput extends PickType(RegisterUserInput, [
  'password',
  'repassword',
]) {}

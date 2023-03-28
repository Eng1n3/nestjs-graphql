import { InputType, PickType } from '@nestjs/graphql';
import { RegisterUserInput } from 'src/users/dto/register.input';

@InputType()
export class ChangePasswordInput extends PickType(RegisterUserInput, [
  'password',
  'repassword',
]) {}

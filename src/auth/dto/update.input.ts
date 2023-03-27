import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { RegisterAdminInput, RegisterUserInput } from './register.input';

@InputType()
export class UpdateUserInput extends PartialType(
  OmitType(RegisterUserInput, ['username', 'email'] as const),
) {}

@InputType()
export class UpdateAdminInput extends PartialType(
  OmitType(RegisterAdminInput, ['username', 'email'] as const),
) {}

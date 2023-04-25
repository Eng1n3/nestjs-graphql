import { InputType, PartialType } from '@nestjs/graphql';
import { RegisterUserInput } from './register.input';

@InputType()
export class UpdateUserInput extends PartialType(RegisterUserInput) {}

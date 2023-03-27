import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateProjectInput } from './create-project.input';

@InputType()
export class UpdateProjectInput extends PartialType(
  OmitType(CreateProjectInput, ['projectName'] as const),
) {}

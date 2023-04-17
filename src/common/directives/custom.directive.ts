import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import { defaultFieldResolver, GraphQLSchema } from 'graphql';
import { DirectiveTranform } from '../enums/directive.enum';
import { ConfigService } from '@nestjs/config';
import '../common/config/config.env';

const configService = new ConfigService();

export function upperDirectiveTransformer(schema: GraphQLSchema) {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const upperDirective = getDirective(
        schema,
        fieldConfig,
        DirectiveTranform.Upper,
      )?.[0];

      const backendUrlDirective = getDirective(
        schema,
        fieldConfig,
        DirectiveTranform.BackEndUrl,
      )?.[0];

      if (upperDirective) {
        const { resolve = defaultFieldResolver } = fieldConfig;

        // Replace the original resolver with a function that *first* calls
        // the original resolver, then converts its result to upper case
        fieldConfig.resolve = async function (source, args, context, info) {
          const result = await resolve(source, args, context, info);
          if (typeof result === 'string') {
            return result.toUpperCase();
          }
          return result;
        };
        return fieldConfig;
      } else if (backendUrlDirective) {
        const { resolve = defaultFieldResolver } = fieldConfig;

        // Replace the original resolver with a function that *first* calls
        // the original resolver, then converts its result to upper case
        fieldConfig.resolve = async function (source, args, context, info) {
          const result = await resolve(source, args, context, info);
          return `${configService.get<string>('DOMAIN')}${result}`;
        };
        return fieldConfig;
      }
    },
  });
}

import { resolve } from 'path';
import { ConfigOptions } from 'src/config/interfaces/config-options.interface';

export function getEnvPath(dest: ConfigOptions): string {
  const env: string | undefined = process.env.NODE_ENV;
  console.log(env);
  const filename: string = env ? `.${env}.env` : '.development.env';
  return resolve(__dirname, '../../../', dest.folder, filename);
}

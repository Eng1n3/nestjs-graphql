import { BadGatewayException, Injectable } from '@nestjs/common';
import { createWriteStream } from 'fs';
import { join } from 'path';

@Injectable()
export class DocumentService {
  private async saveImageToDir(document) {
    return new Promise(async (resolve) => {
      document
        .createReadStream()
        .pipe(
          createWriteStream(
            join(process.cwd(), `./src/uploads/${document.filename}`),
          ),
        )
        .on('finish', () => resolve(`${document.filename}`))
        .on('error', () => {
          new BadGatewayException('Could not save image');
        });
    });
  }
}

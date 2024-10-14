import path from 'node:path';
import { createReadStream, createWriteStream } from 'node:fs';
import { unlink } from 'node:fs/promises';
import { createBrotliCompress } from 'node:zlib';

export const compress = (command) => {
    try {
        const sourceFile = command.split(' ')[1];
        const destinationDirectory = command.split(' ')[2];
        const destinationFilePath = path.join(destinationDirectory, `${path.basename(sourceFile, 'txt')}br`);

        const readStream = createReadStream(sourceFile);
        const writeStream = createWriteStream(destinationFilePath);

        const brotliCompress = createBrotliCompress();

        readStream.pipe(brotliCompress).pipe(writeStream);

        writeStream.on('finish', async () => {                        
            try {
                await unlink(sourceFile);
            } catch {
                console.error('Operation failed');
            }
        });
    } catch {
        console.error('Operation failed');
    };
};

import path from 'node:path';
import { createReadStream, createWriteStream } from 'node:fs';
import { unlink } from 'node:fs/promises';
import { createBrotliDecompress } from 'node:zlib';

export const decompress = (command) => {
    try {
        const sourceFile = command.split(' ')[1];
        const destinationDirectory = command.split(' ')[2];
        const destinationFilePath = path.join(destinationDirectory, `${path.basename(sourceFile, 'br')}txt`);

        const readStream = createReadStream(sourceFile);
        const writeStream = createWriteStream(destinationFilePath);

        const brotliDeompress = createBrotliDecompress();

        readStream.pipe(brotliDeompress).pipe(writeStream);

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

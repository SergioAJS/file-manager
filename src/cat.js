import process from 'node:process';
import { createReadStream } from 'node:fs';

export const cat = async (command) => {
    const readFileStream = async () => {
        return new Promise((resolve, reject) => {
            const stream = createReadStream(command.split(' ')[1], { encoding: 'utf8' });

            stream.on('data', (chunk) => {
                process.stdout.write(chunk);
            });

            stream.on('error', () => {
                reject('Operation failed');
            });

            stream.on ('end', () => {
                resolve();
            });
        });
    };
    try {
        await readFileStream();
        console.log('\n\nFile reading completed');
    } catch {
        console.error('Operation failed');
    };
};

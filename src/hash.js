import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

export const hash = async (command) => {
    try {
        const filePath = command.split(' ')[1];
        const content = await readFile(filePath, { encoding: 'utf8' });
        const fileHash = createHash('sha256').update(content).digest('hex');

        process.stdout.write(fileHash + '\n');
    } catch {
        console.error('Operation failed');
    };
};

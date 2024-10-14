import path from 'node:path';

export const up = async (currentDirectory) => {
    const parentDirectory = path.dirname(currentDirectory);
    process.chdir(parentDirectory);
};

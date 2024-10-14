import { readdir, readFile, rename, unlink } from 'node:fs/promises';

export const ls = async (currentDirectory) => {
    try {
        const directoryContent = await readdir(currentDirectory, { withFileTypes: true});

        const sortedDirectoryContent = await directoryContent.toSorted((a, b) => {
            if (a.isDirectory() && !b.isDirectory())
                return -1;
            if (!a.isDirectory() && b.isDirectory())
                return 1;
        });

        console.table(sortedDirectoryContent.map(content => ({
            Name: content.name,
            Type: content.isDirectory() ? 'Directory' : 'File'
        })))
    } catch {
        console.error('Operation failed');
    };
};

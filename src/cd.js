import path from 'node:path';

export const cd = (currentDirectory, command) => {
    try {
        if (command.split(' ')[1] === '..') {
            const parentDirectory = path.dirname(currentDirectory);
            process.chdir(parentDirectory);   
        } else {
            process.chdir(command.split(' ')[1]);
        }
    } catch {
        console.error('Operation failed');
    };
};

import path from 'node:path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import readLine from 'node:readline';
import process from 'node:process';
import fs from 'node:fs';
import os from 'node:os';
import { opendir, readdir } from 'node:fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const getUsername = () => {
    return process.argv.filter(arg => {
        return arg.startsWith('--username');
    })
};

console.log(`Welcome to the File Manager, ${getUsername().join('').split('=')[1]}!`);

try {
    process.chdir(os.homedir());
} catch {
    console.error('Operation failed');
}

let currentDirectory = process.cwd();

// try {
//     const content = await readdir(__dirname);
//     for (const file of content)
//         console.log(`Directory content: ${file}`);
// } catch {
//     console.error('Operation failed');
// }

// console.log(`Current directory: ${__dirname}`);
// console.log(`Home directory: ${os.homedir()}`);
console.log(`You are currently in ${currentDirectory}\n`);

const question = () => {
    rl.question('Please enter your command: \n', (command) => {
        if (command === 'up') {
            const parentDirectory = path.dirname(currentDirectory);
            process.chdir(parentDirectory);
            currentDirectory = process.cwd();
            console.log(`\nYou are currently in ${currentDirectory}\n`);
            question();
        }
        if (command === '.exit') {
            process.exit();
        }
    });
}

question();

// const parentDirectory = path.dirname(currentDirectory);
// process.chdir(parentDirectory);

// console.log(parentDirectory);

// console.log(`Please enter your command`);

// (function gg(question = '') {
//     rl.question(question, (answer) => {
//       if (answer.match(/^.exit/)) {
//         process.exit();
//       }
//       gg(question = '');
//     });
//   })();

process.on('exit', () => console.log(`Thank you for using File Manager, ${getUsername().join('').split('=')[1]}, goodbye!`));

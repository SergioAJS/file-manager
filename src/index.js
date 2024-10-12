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
    rl.question('Please enter your command: \n', async (command) => {
        switch (command) {
            case 'up':
                const parentDirectory = path.dirname(currentDirectory);
                process.chdir(parentDirectory);
                currentDirectory = process.cwd();
                console.log(`\nYou are currently in ${currentDirectory}\n`);
                question();
                break;
            case 'ls':
                try {
                    const directoryContent = await readdir(currentDirectory, { withFileTypes: true});
    
                    const sortedDirectoryContent = await directoryContent.toSorted((a, b) => {
                        if (a.isDirectory() && !b.isDirectory()) 
                            return -1;
                        if (!a.isDirectory() && b.isDirectory())
                            return 1;
                    })
    
                    console.table(sortedDirectoryContent.map(content => ({
                        Name: content.name,
                        Type: content.isDirectory() ? 'Directory' : 'File'
                    })))
    
                    question();
                } catch {
                    console.error('Operation failed');
                }
                break;
            case 'os --EOL': 
                const EOL = os.EOL;
                console.log(`EOL: ${JSON.stringify(EOL)}`);
                question();
                break;
            case 'os --cpus':
                const cpus = os.cpus();
                console.log(`CPUs info:\nCPUs: ${cpus.length}`);
                console.table(cpus.map(cpu => ({
                    Model: cpu.model,
                    Speed: cpu.speed/1000+' GHz'
                })))
                question();
                break;
            case 'os --homedir':
                const homeDir = os.homedir();
                console.log(`Home directory: ${homeDir}`)
                question();
            case 'os --username':
                const userName = os.userInfo();
                console.log(`Username: ${userName.username}`);
                question();
                break;
            case 'os --architecture':
                const CPUArchitecture = os.arch();
                console.log(`CPU architecture: ${CPUArchitecture}`);
                question();
                break;
            case '.exit':
                process.exit();
            default:
                console.log('Invalid input \n');
                question();
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

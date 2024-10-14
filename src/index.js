import path from 'node:path';
import readLine from 'node:readline';
import process from 'node:process';
import os from 'node:os';
import { createReadStream, createWriteStream } from 'node:fs';
import { rename, unlink } from 'node:fs/promises';
import { up } from './up.js';
import { cd } from './cd.js';
import { ls } from './ls.js';
import { hash } from './hash.js';
import { compress } from './compress.js';
import { decompress } from './decompress.js';
import { cat } from './cat.js';

const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const getUsername = () => {
    return process.argv.filter(arg => {
        return arg.startsWith('--username');
    });
};

console.log(`Welcome to the File Manager, ${getUsername().join('').split('=')[1]}!`);

try {
    process.chdir(os.homedir());
} catch {
    console.error('Operation failed');
};

let currentDirectory = process.cwd();

console.log(`You are currently in ${currentDirectory}\n`);

const question = () => {
    rl.question('Please enter your command: \n', async (command) => {
        switch (command) {
            case 'up':
                up(currentDirectory);
                currentDirectory = process.cwd();
                console.log(`\nYou are currently in ${currentDirectory}\n`);
                question();
                break;
            case `${command.match(/^cd{1}\s.*/)}`:
                try {
                    cd(currentDirectory, command);
                    currentDirectory = process.cwd();    
                    console.log(`\nYou are currently in ${currentDirectory}\n`);
                } finally {
                    question();
                    break;
                };
            case 'ls':
                try {
                    await ls(currentDirectory);
                } finally {
                    question();
                    break;
                };
            case `${command.match(/^cat{1}\s.*/)}`:
                try {
                    await cat(command);
                } finally {
                    question();
                    break;
                };
            case `${command.match(/^add{1}\s.*/)}`:
                try {
                    const writeableStream = createWriteStream(command.split(' ')[1]);

                    writeableStream.end();
                } catch {
                    console.error('Operation failed');
                } finally {
                    question();
                    break;
                };
            case `${command.match(/^rn{1}\s.*/)}`:
                try {
                    const currentFileName = command.split(' ')[1];
                    const newFileName = command.split(' ')[2];

                    await rename(currentFileName, newFileName);
                } catch {
                    console.error('Operation failed');
                } finally {
                    question();
                    break;
                };
            case `${command.match(/^cp{1}\s.*/)}`:
                try {
                    const sourceFile = command.split(' ')[1];
                    const destinationDirectory = command.split(' ')[2];
                    const destinationFilePath = path.join(destinationDirectory, path.basename(sourceFile));

                    const readStream = createReadStream(sourceFile);
                    const writeStream = createWriteStream(destinationFilePath);

                    readStream.pipe(writeStream);
                } catch {
                    console.error('Operation failed');
                } finally {
                    question();
                    break;
                };
            case `${command.match(/^mv{1}\s.*/)}`:
                try {
                    const sourceFile = command.split(' ')[1];
                    const destinationDirectory = command.split(' ')[2];
                    const destinationFilePath = path.join(destinationDirectory, path.basename(sourceFile));

                    const readStream = createReadStream(sourceFile);
                    const writeStream = createWriteStream(destinationFilePath);

                    readStream.pipe(writeStream);

                    writeStream.on('finish', async () => {                        
                        try {
                            await unlink(sourceFile);
                        } catch {
                            console.error('Operation failed');
                        }
                    });
                } catch {
                    console.error('Operation failed');
                } finally {
                    question();
                    break;
                };
            case `${command.match(/^rm{1}\s.*/)}`:
                try {
                    await unlink(command.split(' ')[1]);
                } catch {
                    console.error('Operation failed');
                } finally {
                    question();
                    break;
                };
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
                })));
                question();
                break;
            case 'os --homedir':
                const homeDir = os.homedir();
                console.log(`Home directory: ${homeDir}`);
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
            case `${command.match(/^hash{1}\s.*/)}`:
                try {
                    await hash(command);
                } finally {
                    question();
                    break;
                };
            case `${command.match(/^compress{1}\s.*/)}`:
                try {
                    compress(command);
                } finally {
                    question();
                    break;
                };
            case `${command.match(/^decompress{1}\s.*/)}`:
                try {
                    decompress(command);
                } finally {
                    question();
                    break;
                };
            case '.exit':
                process.exit();
            default:
                console.error('Invalid input \n');
                question();
        };
    });
};

question();

process.on('exit', () => {
    rl.close();
    console.log(`Thank you for using File Manager, ${getUsername().join('').split('=')[1]}, goodbye!`);
});

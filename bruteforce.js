const fs = require('fs');
const crypto = require('crypto');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const chalk = require('chalk');

function sha512(str) {
  return crypto.createHash('sha512').update(str).digest('hex');
}

function* generatePasswords(chars, length) {
  if (length === 1) {
    for (let char of chars) {
      yield char;
    }
  } else {
    for (let char of chars) {
      for (let subPassword of generatePasswords(chars, length - 1)) {
        yield char + subPassword;
      }
    }
  }
}

if (!isMainThread) {
  const { targetHash, username, maxLength, startLength, endLength, characters } = workerData;

  function bruteForce(hash, start, end) {
    const startTime = Date.now();

    for (let length = start; length <= end; length++) {
      for (let password of generatePasswords(characters, length)) {
        if (sha512(password) === hash) {
          const endTime = Date.now();
          const duration = (endTime - startTime) / 1000;
          parentPort.postMessage({ password, duration, username });
          return;
        }
      }
    }
    parentPort.postMessage({ password: null, duration: null });
  }

  bruteForce(targetHash, startLength, endLength);
}

else {
  const fileName = 'valid-accounts.txt';
  const numWorkers = 9;
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  fs.readFile(fileName, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }

    const lines = data.trim().split('\n');
    const batchSize = 1;
    let currentIndex = 0;

    function processBatch() {
      const batchLines = lines.slice(currentIndex, currentIndex + batchSize);
      currentIndex += batchSize;

      batchLines.forEach(line => {
        const parts = line.trim().split(',');
        if (parts.length >= 4) {
          const targetHash = parts[3].trim().toLowerCase();
          const username = parts[1].trim();

          console.log(chalk.red(`[Hailware]`) + chalk.green(` [Brute Force]: `) +  chalk.blue(`Cracking ${targetHash.slice(0, 15)}...`));
          const maxLength = 12;

          const segmentLength = Math.ceil(maxLength / numWorkers);

          function createWorker(startLength, endLength) {
            return new Worker(__filename, {
              workerData: {
                targetHash,
                username,
                maxLength,
                startLength,
                endLength,
                characters,
              }
            });
          }

          const workers = [];
          for (let i = 0; i < numWorkers; i++) {
            const startLength = i * segmentLength + 1;
            const endLength = Math.min((i + 1) * segmentLength, maxLength);
            const worker = createWorker(startLength, endLength);

            worker.on('message', (message) => {
              if (message.password) {
                console.log(chalk.red(`[Hailware]`) + chalk.green(` [HIT]: Cracked -> [Username]: ${message.username} [${targetHash.slice(0, 15)}] | [Password]: ${message.password} | [Duration]: ${message.duration} seconds`));
                workers.forEach((worker) => worker.terminate());
                processBatch();
              }
            });

            worker.on('error', (err) => {
              console.error('Worker error:', err);
            });

            workers.push(worker);
          }
        }
      });

      if (currentIndex < lines.length) {
        // setTimeout(processBatch, 1 * 60 * 2000);
      }
    }

    console.clear();
    processBatch();
  });
}

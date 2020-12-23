
const chalk = require('chalk')
const readline = require('readline')
const {spawn} = require('child_process');
const { emit } = require('process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let child

const start = () => {
  console.log(chalk.magenta('on it'))
  const ls =  spawn('node',['scraper.js'])
  ls.stdout.on('data', (data) => {
    if(''+data === 'finished'){
      return console.log(chalk.green(data))
    }
    console.log(`child: ${data}`);
  });
  
  ls.stderr.on('data', (data) => {
    console.error(chalk.red(`childError`));
    console.error(String(data));
  });
  
  ls.on('close', (code) => {
    child = null
    console.log(`child process exited with code ${code}`);
  });
  
  return ls
}

rl.on('line',((line)=>{
  switch (line.trim()) {
    case 'run':
      child = start()
      break
    case 'kill':
      child 
      ? child.kill()
      : console.log(chalk.red('no child running'))
      child = null
      break
    case 'rs':
      child && child.kill()
      child = start()
      break
    default:
      console.log(chalk.red(`don't know '${line.trim()}'.
      try run, kill, rs`));
      break;
  }
}))

console.log(chalk.green('up!'))
child = start()
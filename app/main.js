const readline = require("readline");
const fs = require("fs");
const { spawn } = require("child_process");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Uncomment this block to pass the first stage
const prompt = ()=>{
    rl.question("$ ", (answer) => {
      if(answer === "exit 0" || answer === "exit") {
        main.exit();
      }else if(answer.startsWith("echo ")){
        const message = answer.slice(5);
        main.echo(message);
      }else if (answer.startsWith("type ")){
        const command = answer.slice(5);
        main.type(command);
      }
      else if(answer.startsWith("pwd")){
        main.pwd();
      }
      else{
        const args = answer.split(" ");
        const command = args[0];
        const commandArgs = args.slice(1);
        const executablePath = findExecutable(command);
        if(executablePath){
          const child = spawn(executablePath, commandArgs, { stdio: "inherit", argv0: command });
          child.on("exit", () => {
            prompt();
          });
        }else{
          console.log(`${answer}: command not found`);
          prompt();
        }
      }
      
    });
}

const main = {
    echo: (message) => {
        console.log(message);
        prompt();
    },
    exit: () => {
        rl.close(); 
    },
    type: (command) => {
        if(command === "echo"){
          console.log("echo is a shell builtin");
          prompt()
        }
        else if(command === "exit"){
          console.log("exit is a shell builtin");
          prompt();
        }else if(command === "pwd"){
          // const cwd = process.cwd();
          console.log(`${command} is a shell builtin`);
          prompt();
        }else if(command === "type"){
          console.log("type is a shell builtin");
          prompt(); 
        }else {
          const executablePath = findExecutable(command);
          if(executablePath){
            console.log(`${command} is ${executablePath}`);
          }else{
            console.log(`${command} not found`);
          }
          prompt();
        }
    },
    pwd: () => {
        const cwd = process.cwd();
        console.log(cwd);
        prompt();
    }
}

const findExecutable = (command) =>{
  const paths = process.env.PATH.split(":");
  for (const path of paths) {
    const filePath = `${path}/${command}`;
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      try {
        fs.accessSync(filePath,fs.constants.X_OK)
        return filePath;
      } catch (error) {
        continue
      }
    }
  }
  return null;  
}

prompt()
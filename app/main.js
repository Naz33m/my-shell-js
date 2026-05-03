const readline = require("readline");
const fs = require("fs");

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
      }else{
        console.log(`${answer}: command not found`);
        prompt();
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
        }else if(command === "type"){
          console.log("type is a shell builtin");
          prompt(); 
        }else {
          const paths = process.env.PATH.split(":");
          let found = false;
          for (const path of paths) {
            const filePath = `${path}/${command}`;
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
              try {
                fs.accessSync(filePath,fs.constants.X_OK)
                console.log(`${command} is ${filePath}`);
                found = true;
                break;
              } catch (error) {
                continue
              }
            }
          }
          if (!found) {
            console.log(`${command}: not found`);
          }
          prompt();
        }
    }
}


prompt()
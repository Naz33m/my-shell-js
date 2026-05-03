const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Uncomment this block to pass the first stage
const prompt = ()=>{
    rl.question("$ ", (answer) => {
      if(answer === "exit 0" || answer === "exit") {
        rl.close();
      }else if(answer.startsWith("echo ")){
        const message = answer.slice(5);
        console.log(message);
        prompt();

      }else if (answer.startsWith("type ")){
        const builtInCommand = answer.slice(5)
        if(builtInCommand === "echo"){
          console.log("echo is a shell builtin command which  prints a message to the console");
          prompt();
        }
        if(builtInCommand === "exit"){
          console.log("exit is a shell builtin command which terminates the shell session");

          // prompt();
          rl.close();
        }else {
          console.log(`${builtInCommand}: command not found`);
          prompt();
        }

      }else{
        console.log(`${answer}: command not found`);
        prompt();
      }
      
    });
}

prompt()
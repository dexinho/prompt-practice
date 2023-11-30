const fs = require("fs");
const readline = require("readline");
const path = require("path");

const interface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const main = () => {
  interface.question("Choose command: ", (command) => {
    if (command === "help") help();
    else if (command === "rc") readCurrent();
    else if (command === "cp") showCurrentPath();
    else if (command.slice(0, 2) === "cd") handleDirPath(command);
    else if (command === "writeDir") {
      interface.question("Dir name: ", (dirName) => {
        writeDir(dirName);
      });
    } else if (command === "writeFile") {
      interface.question("File name: ", (fileName) => {
        interface.question("Content: ", (data) => {
          writeFile(fileName, data);
        });
      });
    }

    main();
  });
};

const help = () => {
  console.log(`List of all commands: 
  - rc: reads content of the current dir
  - cp: shows path to the current dir
  - cd ..: go up one level of the dir tree
  - cd 'dir name': goes down one level and enters desired dir
  - wd 'dir name': creates new dir
  - wf 'file name: creates new file
  - readSpecFile: reads content from existent file
  - copyFile: copies file
  - deleteDir: deletes chosen directory
  - deleteFile: deletes chosen file`);
};

const handleDirPath = (_command) => {
  const choice = _command.split(" ");
  if (choice[1] === "..") {
    const currentPath = process.cwd();
    const parentPath = path.dirname(currentPath);
    process.chdir(parentPath);
    showCurrentPath();
  } else {
    const dirName = choice[1];
    const newPath = path.join(process.cwd(), dirName);
    if (fs.existsSync(newPath) && fs.statSync(newPath).isDirectory()) {
      process.chdir(newPath);
      console.log(`Changed dir to ${dirName}`);
    } else {
      console.log(`Dir "${dirName}" doesn't exist!`);
    }
  }
};

const showCurrentPath = () => {
  console.log(process.cwd());
};

const readCurrent = () => {
  fs.readdir(__dirname, (err, files) => {
    files.forEach((file) => console.log(file));
  });
};

const writeDir = (dirName) => {
  fs.mkdir(dirName, () => {
    console.log(`${dirName} created!`);
  });
};

const writeFile = (_fileName, _data) => {
  fs.writeFile(path.join(__dirname, _fileName), _data, "utf-8", () => {
    console.log(`${_fileName} created!`);
  });
};

main();

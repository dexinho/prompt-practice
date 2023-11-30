const fs = require("fs");
const readline = require("readline");
const path = require("path");

const interface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const main = () => {
  interface.question("Choose command: ", async (command) => {
    try {
      const fullCmd = command.split(" ");
      if (fullCmd.length === 1) {
        switch (command) {
          case "help":
            help();
            break;
          case "cp":
            showCurrentPath();
            break;
          case "rc":
            await readDir();
            break;
          default:
            noSuchCommand();
            break;
        }
      } else if (fullCmd.length === 2) {
        switch (fullCmd[0]) {
          case "cd":
            handleCd(fullCmd[1]);
            break;
          case "wf":
            await writeFile(fullCmd[1]);
            break;
          case "rf":
            await readFile(fullCmd[1]);
            break;
          case "df":
            await deleteFile(fullCmd[1]);
            break;
          case "md":
            await makeDir(fullCmd[1]);
            break;
          case "dd":
            await deleteDir(fullCmd[1]);
            break;
          default:
            noSuchCommand();
            break;
        }
      } else if (fullCmd[0] === "cfc" && fullCmd.length === 3)
        await copyFileContent(fullCmd[1], fullCmd[2]);
      else noSuchCommand();

      main();
    } catch (err) {
      console.log(err);
    }
  });
};

const noSuchCommand = () => {
  console.log("There is no such command available!");
};

const help = () => {
  console.log(`List of all commands: 
  - rc: reads content of the current directory
  - cp: shows path to the current directory
  - rf: reads content from existing file
  - cd ..: go up one level of the directory tree
  - cd dir-name: goes down one level and enters desired directory
  - md dir-name: creates new directory
  - wf file-name: creates new file
  - dd dir-name: deletes directory
  - df file-name: deletes file
  - cfc source-file destination-file: copies contents from source file into the destination file`);
};

const handleCd = (command) => {
  if (command === "..") {
    const currentPath = process.cwd();
    const parentPath = path.dirname(currentPath);
    process.chdir(parentPath);
    showCurrentPath();
  } else {
    const dirName = command;
    const newPath = path.join(process.cwd(), dirName);
    if (fs.existsSync(newPath) && fs.statSync(newPath).isDirectory()) {
      process.chdir(newPath);
    } else {
      console.log(`Directory "${dirName}" doesn't exist!`);
    }
    console.log(process.cwd());
  }
};

const showCurrentPath = () => {
  console.log(process.cwd());
};

const readDir = (isLoggable = true) => {
  return new Promise((res) => {
    fs.readdir(process.cwd(), (err, files) => {
      if (err) console.log(err);
      else if (isLoggable) files.forEach((file) => console.log(file));
      res(files);
    });
  });
};

const writeFile = (fileName) => {
  return new Promise((res) => {
    fs.writeFile(path.join(process.cwd(), fileName), "", "utf-8", (err) => {
      if (err) console.log(err);
      else console.log(`${fileName} created!`);
      res();
    });
  });
};

const readFile = (fileName) => {
  return new Promise((res) => {
    fs.readFile(path.join(process.cwd(), fileName), "utf-8", (err, data) => {
      if (err) console.log(err);
      else console.log(data);
      res();
    });
  });
};

const deleteFile = (fileName) => {
  return new Promise((res) => {
    fs.unlink(path.join(process.cwd(), fileName), (err) => {
      if (err) console.log(err);
      else console.log(`${fileName} deleted!`);
      res();
    });
  });
};

const deleteDir = (dirName) => {
  return new Promise((res) => {
    fs.rmdir(path.join(process.cwd(), dirName), (err) => {
      if (err) console.log(err);
      else console.log(`${dirName} deleted!`);
      res();
    });
  });
};

const makeDir = (dirName) => {
  return new Promise((res) => {
    fs.mkdir(path.join(process.cwd(), dirName), { recursive: true }, (err) => {
      if (err) console.log(err);
      else console.log(`${dirName} created!`);
      res();
    });
  });
};

const copyFileContent = async (sourceFile, destinationFile) => {
  try {
    const files = await readDir(false);

    if (files.includes(sourceFile) && files.includes(destinationFile)) {
      const sourceData = fs.readFileSync(
        path.join(process.cwd(), sourceFile),
        "utf-8"
      );
      return new Promise((res) => {
        fs.appendFile(
          path.join(process.cwd(), destinationFile),
          sourceData,
          (err) => {
            if (err) console.log(err);
            else
              console.log(
                `Data from ${sourceFile} copied to ${destinationFile}!`
              );
            res();
          }
        );
      });
    } else {
      console.log("One or both files are missing!");
    }
  } catch (err) {
    console.log(err);
  }
};

main();

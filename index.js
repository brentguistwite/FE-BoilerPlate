const fs = require("fs");

const argMap = new Map();

process.argv
  .slice(2)
  .map((arg) => arg.split(":"))
  .forEach((b) => {
    argMap.set(b[0], b[1]);
  });

const fileName = argMap.get("fileName");

const files = [
  {
    content: `export { default } from './{name}';\n`,
    path: "index.ts",
  },
  {
    content: `import React, { FC } from 'react';

import { foo } from './{name}.less';

const {name}: FC<any> = () => {
  return <div>Hello World</div>;
};

export default {name};
`,
    path: "{name}.tsx",
  },
  {
    content: ".foo {\n\tvisibility: visible;\n}\n",
    path: "{name}.less",
  },
  {
    content: "export const foo: string;\n",
    path: "{name}.less.d.ts",
  },
  {
    content: `import { render } from '@testing-library/react';
import React from 'react';

import {name} from './{name}';

describe('{name} component', () => {
  it('Renders without crashing', () => {
    render(<{name}/>);
  });
});
`,
    path: "{name}.test.tsx",
  },
];

const findFile = (file) => {
  try {
    fs.exists(file, (exists) => {
      if (exists) {
        console.error("FILE ALREADY EXISTS");
        return true;
      }
    });
    return false;
  } catch (e) {
    console.log("ERROR", e);
    throw e;
  }
};

const startCallback = (newFile) => (err) => {
  if (err) {
    throw new Error(err);
  }
  console.log(`File created at ${process.cwd()}/${fileName}/${newFile}`);
};

const writeFile = (file, content, callback) => {
  fs.appendFile(file, content, callback);
};

const createFiles = (folderPath) => {
  files.forEach(({ content, path }) => {
    const updatedPath = path.replace("{name}", fileName);
    let updatedContent = content.replace("{name}", fileName);

    while (updatedContent.includes("{name}")) {
      updatedContent = updatedContent.replace("{name}", fileName);
    }

    const filePath = `${folderPath}/${updatedPath}`;
    const fileAlreadyExists = findFile(filePath);

    if (fileAlreadyExists) {
      const errMsg = `File ${updatedPath} already exists`;
      throw new Error(errMsg);
    }

    writeFile(filePath, updatedContent, startCallback(updatedPath));
  });
};

(() => {
  const folderPath = `${process.cwd()}/${fileName}`;
  fs.mkdir(folderPath, {}, (err) => {
    if (err) {
      console.error("Error occured making folder");
      throw new Error(err);
    }

    createFiles(folderPath);
  });
})();

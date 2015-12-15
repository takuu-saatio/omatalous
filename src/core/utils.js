import fs from "fs";
import { join } from "path";
import Promise from "bluebird";

export async function readContent(path) {
    
  const CONTENT_DIR = join(__dirname, "./content");

  const readFile = Promise.promisify(fs.readFile);
  const fileExists = filename => new Promise(resolve => {
    fs.exists(filename, resolve);
  });

  console.log("content path: ", path);
  if (!path || path === "undefined") {
    return { 
      data: { error: `The "path" query parameter cannot be empty.` },
      statusCode: 404 
    };
  }

  let fileName = join(CONTENT_DIR, (path === "/" ? "/index" : path));
  let contentFile = fileName + ".html";
  let metaFile = fileName + ".json";
  if (!(await fileExists(contentFile))) {
    fileName = join(CONTENT_DIR, path + "/index");
    contentFile = fileName + ".html";
    metaFile = fileName + ".json";
  }

  if (!(await fileExists(contentFile))) {
    return { 
      data: { error: `The page "${path}" is not found.`},
      statusCode: 404 
    };
  } else {
    const content = await readFile(contentFile, { encoding: "utf8" });
    const meta = JSON.parse((await fileExists(metaFile)) ? (await readFile(metaFile)) : "{}");
    return { 
      data: { content: content, meta: meta },
      statusCode: 200 
    };
  }

}

    

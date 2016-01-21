import fs from "fs";
import { join } from "path";
import Promise from "bluebird";

const readFile = Promise.promisify(fs.readFile);
const fileExists = filename => new Promise(resolve => {
  fs.exists(filename, resolve);
});

export async function readContent(path) {
    
  const CONTENT_DIR = join(__dirname, "./content");

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

export async function readLocalizedMessages(locale) {

  const MSG_DIR = join(__dirname, "./content/messages");
  const fileName = join(MSG_DIR, `/${locale}.json`);

  const intlData = (await fileExists(fileName)) ? JSON.parse(await readFile(fileName)) : null;

  console.log("got intl data...", intlData);

  return intlData;

}

export function getCurrentMonth() {

  const date = new Date();
  const monthPadding = date.getMonth() < 9 ? "0" : "";
  const currentMonth = date.getFullYear() + "-" +
    monthPadding + (date.getMonth() + 1);

  return currentMonth;

}


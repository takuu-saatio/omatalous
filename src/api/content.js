import fs from "fs";
import { join } from "path";
import { Router } from "express";
import Promise from "bluebird";
import fm from "front-matter";

// A folder with Jade/Markdown/HTML content pages
const CONTENT_DIR = join(__dirname, "./content");

const readFile = Promise.promisify(fs.readFile);
const fileExists = filename => new Promise(resolve => {
  fs.exists(filename, resolve);
});

const router = new Router();

router.get("/", async (req, res, next) => {
  
  try {
    
    const path = req.query.path;
    console.log("content path: ", path);
    if (!path || path === "undefined") {
      res.status(400).send({ error: `The "path" query parameter cannot be empty.` });
      return;
    }

    let fileName = join(CONTENT_DIR, (path === "/" ? "/index" : path) + ".html");
    if (!(await fileExists(fileName))) {
      fileName = join(CONTENT_DIR, path + "/index.html");
    }

    if (!(await fileExists(fileName))) {
      res.status(404).send({ error: `The page "${path}" is not found.` });
    } else {
      const source = await readFile(fileName, { encoding: "utf8" });
      console.log("content: ", source);
      res.status(200).send(source);
    }

  } catch (err) {
    next(err);
  }

});

export default router;

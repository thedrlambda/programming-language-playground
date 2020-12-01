import { parse } from "./cparser";
import * as fs from "fs";

let filename = process.argv[2];
let content = fs.readFileSync(filename).toString();

console.log("Before");
console.log(parse(content));
console.log("After");

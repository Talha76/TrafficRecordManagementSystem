import * as fs from "fs";
import {exec} from "child_process";

export default function latexToPdf(data) {
  return new Promise((resolve, reject) => {
    if (data === undefined || data === null) data = "";
    const start = fs.readFileSync("src/report/start.tex", "utf-8");
    const end = fs.readFileSync("src/report/end.tex", "utf-8");

    const finalData = start + data + end;

    fs.writeFileSync("src/report/final.tex", finalData);

    const cmd = "xelatex -jobname=output src/report/final.tex";
    const child = exec(cmd);
    child.stdout.on("data", data => console.log(`stdout: ${data}`));
    child.stderr.on("data", data => console.error(`stderr: ${data}`));
    child.on("close", code => {
      console.log(`child process exited with code ${code}`);
      if (code === 0) {
        console.log("PDF generation successful.");
        resolve();
      } else {
        reject(new Error("PDF generation failed."));
      }
    });
  });
}

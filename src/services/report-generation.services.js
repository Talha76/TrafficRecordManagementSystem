import latexToPdf from "../utils/latex.js";

function initHeadings(headings) {
  let latex = "\\begin{tabular}{|";

  for (const heading of headings) {
    latex += "c|";
  }
  latex += "}\n\\hline\n";

  for (const heading of headings) {
    latex += `\\textbf{${heading}} & `;
  }
  latex = latex.slice(0, -2);
  latex += "\\\\\n\\hline\\hline\n";

  return latex;
}

/**
 * Generates a PDF report from the given data.
 * @param headings - Headings of the table columns{Array<String>}
 * @param props - Properties of the data object{Array<String>}
 * @param data - Data to be displayed{Array<Object>}
 */
export default function generateReport(headings, props, data) {
  let latex = initHeadings(headings);

  let i = 0;
  for (; i < Math.min(35, data.length); i++) {
    for (const prop of props) {
      latex += `${data[i][prop]} & `;
    }
    latex = latex.slice(0, -2);
    latex += "\\\\\n\\hline\n";
  }
  latex += "\\end{tabular}\n";

  for (i = 35; i < data.length;) {
    latex += initHeadings(headings);
    for (let j = 0; j < 50 && i < data.length; j++, i++) {
      for (const prop of props) {
        latex += `${data[i][prop]} & `;
      }
      latex = latex.slice(0, -2);
      latex += "\\\\\n\\hline\n";
    }
    latex += "\\end{tabular}\n";
  }

  latexToPdf(latex);
}
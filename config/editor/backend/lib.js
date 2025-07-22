const jsdom = require("jsdom");

exports.createTextMap = (text) =>
  text
    .split("\n")
    .map((line) => line.trim().split(" "))
    .reduce((acc, curr, i, arr) => {
      if (typeof curr === "object") {
        if (i === arr.length - 1) {
          return [...acc, ...curr];
        }
        return [...acc, ...curr, "\n"];
      }
      return [...acc, curr];
    }, [])
    .map((val) => ({ val }));

exports.toHtml = (data) => {
  const { JSDOM } = jsdom;
  const dom = new JSDOM();
  const text = data.map((node) => node.val).join(" ");
  const dataWithoutBreaks = data.filter((node) => node.val !== "\n");
  const container = dom.window.document.createElement("div");

  let totalNodes = 0;
  text
    .split("\n")
    .map((line) => line.trim())
    .forEach((line) => {
      const p = dom.window.document.createElement("p");
      let span = null;
      const lineNodes = line.split(" ");
      lineNodes.forEach((node, i) => {
        const index = totalNodes + i;
        // found a plahead
        if (dataWithoutBreaks[index].playhead) {
          // if there's already a span, now's the time to append it to the paragraph
          if (span) {
            p.appendChild(span);
            if (i < lineNodes.length) {
              // also if this span is not the last of the line, let's add a space after it
              p.innerHTML += " ";
            }
          }
          // create a new span
          span = dom.window.document.createElement("span");
          span.setAttribute("data-playhead", dataWithoutBreaks[index].playhead);
        }

        // const textContent = `${node} `;
        let textContent = node;
        if (!span && !dataWithoutBreaks[index].playhead) {
          textContent = `${node} `;
          const textNode = dom.window.document.createTextNode(textContent);
          p.appendChild(textNode);
          return;
        }
        // add the current node to the current span
        // if it's not the last node in the paragraph, add a space

        textContent =
          (dataWithoutBreaks[index + 1] &&
            dataWithoutBreaks[index + 1].playhead) ||
          i === lineNodes.length - 1
            ? node
            : `${node} `;

        span.textContent += textContent;

        if (i === lineNodes.length - 1) {
          p.appendChild(span);
          span = null;
        }
      });
      totalNodes += lineNodes.length;
      container.appendChild(p);
    });
  return container.innerHTML;
};

exports.getAnswers = function(exercise) {
  switch (exercise.type) {
    case "true-or-false":
      return exercise.answer
        .split(",")
        .map((answer) =>
          answer % 2 === 0 ? exercise.trueLabel : exercise.falseLabel
        );

    case "select-one":
      return exercise.choices.map(
        (choice) => choice.textChoices[parseInt(choice.answer, 10)]
      );

    case "select-many":
      return exercise.choices.map(
        (choice) => choice.textChoices[parseInt(choice.answer, 10)]
      );

    case "fill-in-the-blank":
      return exercise.answer
        .split(",")
        .map((a) => (exercise.choices[a] ? exercise.choices[a].text : ""));

    case "multiple-choice":
      return exercise.answer
        .split(",")
        .map((a) => (exercise.choices[a] ? exercise.choices[a].text : ""));

    case "multi-fill-in-the-blank":
      return exercise.choices.map((choice) => {
        const answerIndices = choice.answer.split(",").map(Number);
        return answerIndices.map(index => choice.textChoices[index]).join(", ");
      });

    default:
      return exercise.choices.map((choice) => choice.answer + " ");
  }
};

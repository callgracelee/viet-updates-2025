import {
  INITIAL,
  TOUCHED,
  VALIDATED_CORRECT,
  VALIDATED_INCORRECT,
  SHOWING_ANSWERS_ONLY,
  INPUT_SELECTOR,
  RESET_CONTROL_SELECTOR,
  VALIDATE_CONTROL_SELECTOR,
  DATA_TOGGLED_ATTRIBUTE,
  DATA_CORRECT_ATTRIBUTE,
  DATA_INCORRECT_ATTRIBUTE,
} from "../constants";

export const FindPattern = {
  before() {
    var _this = this;

    // Set data-index for each input
    this.components["answer-inputs"].nodes.forEach((node, i) => {
      node.setAttribute("data-index", i);
    });

    // Prepare to get answerKey. The generated html has some nested structures
    let inputCounts = [];

    this.components["answers"].nodes.forEach((node, i) => {
      const childrenDataIndexValues = Array.from(node.children).map(
        (childNode) => {
          return parseInt(childNode.getAttribute("data-index"), 10);
        }
      );

      inputCounts.push(childrenDataIndexValues);
    });

    // example: [[0, 1], [11, 12], [13.14]]
    this.answerKey = inputCounts;
    this.node.setAttribute("data-answer", JSON.stringify(this.answerKey));

    // total correct answer input
    this.components["total-inputs"].nodes[0].textContent = inputCounts.length;

    // Remove nesting sturctures
    this.components["answers"].nodes.forEach((el) => {
      const parent = el.parentNode;
      while (el.firstChild) {
        parent.insertBefore(el.firstChild, el);
      }
      parent.removeChild(el);
    });

    // Partial selections
    this.partials = [];
    this.commitButtons = [];

    // et consecutive sets from partials
    let consecutiveSets = [];

    function getConsecutiveSets(arr) {
      const sets = [];
      let currentSet = [];

      for (let i = 0; i < arr.length; i++) {
        if (i > 0 && arr[i] === arr[i - 1] + 1) {
          const index = arr[i];
          // const node = _this.components["answer-inputs"].nodes[index];

          const node = _this.components["answer-inputs"].nodes.find((node) => {
            return (
              node.hasAttribute("data-index") &&
              node.getAttribute("data-index") == index
            );
          });

          if (
            node.previousSibling &&
            node.previousSibling.nodeType === 3 && // Ensure it's a text node
            node.previousSibling.nodeValue.trim() !== ""
          ) {
            console.log("node.previousSibling", node.previousSibling);
            if (currentSet.length > 1) {
              sets.push([...currentSet]);
            }
            currentSet = [arr[i]];
          } else {
            currentSet.push(arr[i]);
          }
        } else {
          if (currentSet.length > 1) {
            sets.push([...currentSet]);
          }
          currentSet = [arr[i]];
        }
      }

      if (currentSet.length > 1) {
        sets.push([...currentSet]);
      }

      return sets;
    }

    function createCommitButton(consecutiveSet, index) {
      const commitButton = document.createElement("button");
      commitButton.textContent = "Commit";
      commitButton.setAttribute("data-commit", true);

      // Give position relative to the last node of the consecutive set
      consecutiveSet.forEach(function(item, i) {
        if (i === consecutiveSet.length - 1) {
          const lastNode = _this.components["answer-inputs"].nodes.find(
            (node) => {
              return (
                node.hasAttribute("data-index") &&
                node.getAttribute("data-index") == item
              );
            }
          );
          const indexOfNode = Array.from(
            _this.components["answer-inputs"].nodes
          ).indexOf(lastNode);

          _this.components["answer-inputs"].nodes[indexOfNode].style.position =
            "relative";
          _this.components["answer-inputs"].nodes[indexOfNode].appendChild(
            commitButton
          );
        }
      });

      const commitButtonInfo = {
        indexes: consecutiveSet,
        button: commitButton,
      };

      _this.commitButtons.push(commitButtonInfo);

      commitButton.addEventListener("click", () =>
        handleCommitAction(commitButtonInfo)
      );
    }

    this.handlePartialSelection = function(el) {
      let dataIndex;

      if (el.hasAttribute("data-index")) {
        dataIndex = parseInt(el.getAttribute("data-index"));
      }
      // If the parent node has data-toggled
      if (el.hasAttribute("data-toggled")) {
        const parent = el.parentNode;
        const childNodes = Array.from(el.childNodes);

        childNodes.forEach((childNode, index) => {
          if (index === 0) {
            dataIndex = parseInt(childNode.getAttribute("data-index"));
          }
          parent.insertBefore(childNode, el);
        });
        parent.removeChild(el);
        removeResponseByDataIndex();
      } else if (el.parentNode.hasAttribute("data-toggled")) {
        removeResponseByDataIndex();
      } else if (el.hasAttribute("data-partial-toggled")) {
        el.removeAttribute("data-partial-toggled");
        removePartial(dataIndex);
      } else {
        el.setAttribute("data-partial-toggled", true);
        addPartial(dataIndex);
      }

      function removeResponseByDataIndex() {
        const responses = _this.state.responses;

        for (let i = 0; i < responses.length; i++) {
          const subarray = responses[i];
          for (let j = 0; j < subarray.length; j++) {
            if (subarray[j] === dataIndex) {
              responses.splice(i, 1);
              _this.setState({
                name: TOUCHED,
                responses: responses,
              });
              // return;
            }
          }
          // if nothing in the responses, set it to intitial state
          if (responses.length === 0) {
            _this.setState({
              name: "INITIAL",
              responses: [],
            });
          }
        }
      }

      const consecutiveSets = getConsecutiveSets(_this.partials);
      removeAllCommitButtons();
      _this.commitButtons = consecutiveSets.map((consecutiveSet, index) => ({
        indexes: consecutiveSet,
        button: createCommitButton(consecutiveSet, index),
      }));
    };

    function addPartial(index) {
      _this.partials.push(index);
      _this.partials.sort((a, b) => a - b);
    }

    function removePartial(index) {
      console.log("removePartial");
      _this.partials = _this.partials.filter((item) => item !== index);
    }

    function removeAllCommitButtons() {
      document
        .querySelectorAll("[data-commit]")
        .forEach((button) => button.remove());
    }

    function handleCommitAction(commitButtonInfo) {
      // Remove the event listener
      commitButtonInfo.button.removeEventListener("click", handleCommitAction);

      commitButtonInfo.button.remove();

      _this.partials = _this.partials.filter(
        (item) => !commitButtonInfo.indexes.includes(item)
      );

      commitButtonInfo.indexes.forEach((index) => {
        const targetInput = Array.from(
          _this.components["answer-inputs"].nodes
        ).find((node) => node.getAttribute("data-index") == index);

        if (targetInput) {
          targetInput.removeAttribute("data-partial-toggled");
        }
      });

      _this.setState({
        name: TOUCHED,
        responses: [..._this.state.responses, commitButtonInfo.indexes],
      });
    }
  },
  reset: function reset() {
    this.partials = [];
    this.commitButtons = [];

    const commitButtons = document.querySelectorAll("[data-commit]");
    commitButtons.forEach((button) => button.remove());

    this.setState({
      name: "INITIAL",
      responses: [],
    });

    this.components["answer-inputs"].nodes.forEach((el) => {
      el.style.removeProperty("pointer-events");
      // Check if the element has nested elements
      if (el.children.length > 0) {
        const fragment = document.createDocumentFragment();

        Array.from(el.childNodes).forEach((child, index) => {
          const nextSibling = el.nextSibling;

          if (child.nodeType === 1) {
            child.removeAttribute("style");
          }

          fragment.appendChild(child);

          if (
            // Target a period node
            (nextSibling &&
              nextSibling.nodeType === 3 &&
              nextSibling.nodeValue.trim() === ".") ||
            nextSibling.nodeValue.trim() === "," ||
            nextSibling.nodeValue.trim() === ":" ||
            nextSibling.nodeValue.trim() === "!" ||
            nextSibling.nodeValue.trim() === "..."
          ) {
          } else {
            fragment.appendChild(document.createTextNode(" "));
          }
        });

        el.parentNode.insertBefore(fragment, el);
        el.remove();
      }
    });
  },
  compare: function compare() {
    // 0,1,11,12,13,14
    var responseKey = this.getResponseKey();
    return responseKey === this.answerKey.join(",");
  },

  components: {
    "validate-button": VALIDATE_CONTROL_SELECTOR,
    "reset-button": RESET_CONTROL_SELECTOR,
    "answer-inputs": INPUT_SELECTOR,
    "total-inputs": "[data-total-inputs]",
    "inputs-toggled": "[data-inputs-toggled]",
    answers: "[data-answer-input]",
  },
  transitions: {
    [INITIAL]: {
      "inputs-toggled": {
        effects: function effects(el) {
          el.textContent = "0";
        },
      },
      "answer-inputs": {
        effects: function effects(el) {
          el.disabled = false;
          el.removeAttribute(DATA_TOGGLED_ATTRIBUTE);
          el.removeAttribute(DATA_CORRECT_ATTRIBUTE);
          el.removeAttribute(DATA_INCORRECT_ATTRIBUTE);
          el.removeAttribute("data-partial-toggled");
          el.style.removeProperty("position");
        },
        handlers: {
          click: function click(e, targetIndex) {
            this.handlePartialSelection(e.target, targetIndex);
          },
        },
      },
    },
    [TOUCHED]: {
      "inputs-toggled": {
        effects: function effects(el, i) {
          el.textContent = this.state.responses.length;
          this.registerComponent("answer-inputs", INPUT_SELECTOR);

          const responses = this.state.responses;

          this.state.responses.forEach((response) => {
            let wrapperSpan = document.createElement("span");
            wrapperSpan.setAttribute("data-input", true);
            wrapperSpan.setAttribute("data-toggled", true);

            let spansToWrap = [];

            let parentP;

            response.forEach((r, i) => {
              let spanToWrap = Array.from(
                this.components["answer-inputs"].nodes
              ).find((span, j) => j == r);

              if (spanToWrap) {
                parentP = this.components["answer-inputs"].nodes[r].closest(
                  "p, li"
                );
                spansToWrap.push(spanToWrap);
              }
            });

            spansToWrap.forEach((span, index) => {
              const nextSibling = span.nextSibling;
              wrapperSpan.appendChild(span.cloneNode(true));
              if (index < spansToWrap.length - 1) {
                wrapperSpan.appendChild(document.createTextNode(" "));
              }
            });

            if (spansToWrap.length > 0) {
              parentP.insertBefore(wrapperSpan, spansToWrap[0]);
              // wrapperSpan.disabled = true;
            }

            spansToWrap.forEach((span) => {
              // debugger;
              const nextSibling = span.nextSibling;

              if (
                // Target any space if it is not the past span
                nextSibling &&
                nextSibling.nodeType === 3 &&
                nextSibling.nodeValue.trim() !== "." &&
                nextSibling.nodeValue.trim() !== "," &&
                nextSibling.nodeValue.trim() !== ":" &&
                span !== spansToWrap[spansToWrap.length - 1]
              ) {
                nextSibling.remove();
              }
              span.parentNode.removeChild(span);
            });
          });

          this.registerComponent("answer-inputs", INPUT_SELECTOR);
        },
      },
      "answer-inputs": {
        effects: function effects(el, i) {
          el.disabled = false;
          if (el.hasAttribute("data-toggled")) {
            const fragment = document.createDocumentFragment();
            while (el.firstChild) {
              fragment.appendChild(el.firstChild);
            }
            el.replaceWith(fragment);
          }
        },
        handlers: {
          click: function click(e, targetIndex) {
            this.handlePartialSelection(e.target, targetIndex);
          },
        },
      },
    },
    [VALIDATED_INCORRECT]: {
      "inputs-toggled": {
        effects: function effects(el) {
          el.textContent = this.state.responses.length;
          this.registerComponent("answer-inputs", INPUT_SELECTOR);

          this.state.responses.forEach((response) => {
            let wrapperSpan = document.createElement("span");
            wrapperSpan.setAttribute("data-input", true);
            wrapperSpan.setAttribute("data-toggled", true);
            let spansToWrap = [];
            let parentP;

            // debugger;

            response.forEach((r, i) => {
              let spanToWrap = Array.from(
                this.components["answer-inputs"].nodes
              ).find((span, j) => j == r);

              if (spanToWrap) {
                parentP = this.components["answer-inputs"].nodes[r].closest(
                  "p, li"
                );
                spansToWrap.push(spanToWrap);
              }
            });

            spansToWrap.forEach((span, index) => {
              wrapperSpan.appendChild(span.cloneNode(true));

              // Add a space after each span (except the last one)
              if (index < spansToWrap.length - 1) {
                wrapperSpan.appendChild(document.createTextNode(" "));
              }
            });

            if (spansToWrap.length > 0) {
              parentP.insertBefore(wrapperSpan, spansToWrap[0]);
            }

            spansToWrap.forEach((span) => {
              const nextSibling = span.nextSibling;
              if (
                // Target any space if it is not the past span
                nextSibling &&
                nextSibling.nodeType === 3 &&
                nextSibling.nodeValue.trim() !== "." &&
                nextSibling.nodeValue.trim() !== "," &&
                nextSibling.nodeValue.trim() !== ":" &&
                span !== spansToWrap[spansToWrap.length - 1]
              ) {
                nextSibling.remove();
              }
              span.parentNode.removeChild(span);
            });
          });

          this.registerComponent("answer-inputs", INPUT_SELECTOR);

          this.components["answer-inputs"].nodes.forEach((el) => {
            if (el.hasAttribute("data-toggled")) {
              const children = el.children;
              const dataIndexValues = [];

              for (let j = 0; j < children.length; j++) {
                const child = children[j];
                dataIndexValues.push(child.getAttribute("data-index"));
              }

              const hasMatchingSubarray = this.answerKey.some((subarray) => {
                // Check if subarray has the same length as dataIndexValues
                if (subarray.length !== dataIndexValues.length) {
                  return false;
                }

                return subarray.every(
                  (value, index) =>
                    parseInt(value, 10) === parseInt(dataIndexValues[index], 10)
                );
              });

              if (hasMatchingSubarray) {
                el.setAttribute("data-correct", true);
              } else {
                el.setAttribute("data-incorrect", true);
              }
            }
          });
        },
      },
      "answer-inputs": {
        effects: function effects(el, i) {
          el.style.pointerEvents = "none";
          el.removeAttribute("data-partial-toggled");
          el.style.removeProperty("position");
          const commitButtons = document.querySelectorAll("[data-commit]");
          commitButtons.forEach((button) => button.remove());

          el.disabled = true;
          if (el.hasAttribute("data-toggled")) {
            const fragment = document.createDocumentFragment();
            while (el.firstChild) {
              fragment.appendChild(el.firstChild);
            }
            el.replaceWith(fragment);
          }
        },
      },
    },
    [VALIDATED_CORRECT]: {
      "inputs-toggled": {
        effects: function effects(el) {
          console.log("validated correct!");
          el.textContent = this.state.responses.length;
          this.registerComponent("answer-inputs", INPUT_SELECTOR);

          this.state.responses.forEach((response) => {
            let wrapperSpan = document.createElement("span");
            wrapperSpan.setAttribute("data-input", true);
            wrapperSpan.setAttribute("data-toggled", true);
            let spansToWrap = [];
            let parentP;

            // debugger;

            response.forEach((r, i) => {
              let spanToWrap = Array.from(
                this.components["answer-inputs"].nodes
              ).find((span, j) => j == r);

              if (spanToWrap) {
                parentP = this.components["answer-inputs"].nodes[r].closest(
                  "p, li"
                );
                spansToWrap.push(spanToWrap);
              }
            });

            spansToWrap.forEach((span, index) => {
              wrapperSpan.appendChild(span.cloneNode(true));

              // Add a space after each span (except the last one)
              if (index < spansToWrap.length - 1) {
                wrapperSpan.appendChild(document.createTextNode(" "));
              }
            });

            if (spansToWrap.length > 0) {
              parentP.insertBefore(wrapperSpan, spansToWrap[0]);
            }

            spansToWrap.forEach((span) => {
              const nextSibling = span.nextSibling;
              if (
                // Target any space if it is not the past span
                nextSibling &&
                nextSibling.nodeType === 3 &&
                nextSibling.nodeValue.trim() !== "." &&
                nextSibling.nodeValue.trim() !== "," &&
                nextSibling.nodeValue.trim() !== ":" &&
                span !== spansToWrap[spansToWrap.length - 1]
              ) {
                nextSibling.remove();
              }
              span.parentNode.removeChild(span);
            });
          });

          this.registerComponent("answer-inputs", INPUT_SELECTOR);

          this.components["answer-inputs"].nodes.forEach((el) => {
            if (el.hasAttribute("data-toggled")) {
              const children = el.children;
              const dataIndexValues = [];

              for (let j = 0; j < children.length; j++) {
                const child = children[j];
                dataIndexValues.push(child.getAttribute("data-index"));
              }

              const hasMatchingSubarray = this.answerKey.some((subarray) => {
                // Check if subarray has the same length as dataIndexValues
                if (subarray.length !== dataIndexValues.length) {
                  return false;
                }

                return subarray.every(
                  (value, index) =>
                    parseInt(value, 10) === parseInt(dataIndexValues[index], 10)
                );
              });

              if (hasMatchingSubarray) {
                el.setAttribute("data-correct", true);
              } else {
                el.setAttribute("data-incorrect", true);
              }
            }
          });
        },
      },
      "answer-inputs": {
        effects: function effects(el, i) {
          el.style.pointerEvents = "none";
          el.removeAttribute("data-partial-toggled");
          el.style.removeProperty("position");
          const commitButtons = document.querySelectorAll("[data-commit]");
          commitButtons.forEach((button) => button.remove());

          el.disabled = true;
          if (el.hasAttribute("data-toggled")) {
            const fragment = document.createDocumentFragment();
            while (el.firstChild) {
              fragment.appendChild(el.firstChild);
            }
            el.replaceWith(fragment);
          }
        },
      },
      "validate-button": {
        effects: function effects(el) {
          el.setAttribute("disabled", true);
          el.textContent = "Correct!"; // el.blur();
        },
      },
      "reset-button": {
        effects: function effects(el) {
          // el.focus();
        },
      },
    },
    [SHOWING_ANSWERS_ONLY]: {
      "inputs-toggled": {
        effects: function effects(el) {
          el.textContent = this.state.responses.length;
          console.log("showing answer");

          // Resets the html
          this.components["answer-inputs"].nodes.forEach((el) => {
            el.disabled = true;
            if (el.hasAttribute("data-toggled")) {
              const fragment = document.createDocumentFragment();
              while (el.firstChild) {
                fragment.appendChild(el.firstChild);
              }
              el.replaceWith(fragment);
            }
          });

          this.registerComponent("answer-inputs", INPUT_SELECTOR);
          // const parentP =
          //   this.components["answer-inputs"].nodes[0].closest("p");

          this.answerKey.forEach((key) => {
            let wrapperSpan = document.createElement("span");
            wrapperSpan.setAttribute("data-input", true);
            wrapperSpan.setAttribute("data-toggled", true);

            let spansToWrap = [];

            let parentP;

            key.forEach((r, i) => {
              let spanToWrap = Array.from(
                this.components["answer-inputs"].nodes
              ).find((span, j) => j == r);

              if (spanToWrap) {
                parentP = this.components["answer-inputs"].nodes[r].closest(
                  "p, li"
                );
                spansToWrap.push(spanToWrap);
              }
            });

            spansToWrap.forEach((span, index) => {
              const nextSibling = span.nextSibling;
              if (
                // Target any space if it is not the past span
                nextSibling &&
                nextSibling.nodeType === 3 &&
                nextSibling.nodeValue.trim() !== "." &&
                nextSibling.nodeValue.trim() !== "," &&
                nextSibling.nodeValue.trim() !== ":" &&
                nextSibling.nodeValue.trim() !== "!" &&
                nextSibling.nodeValue.trim() !== "..." &&
                span !== spansToWrap[spansToWrap.length - 1]
              ) {
                nextSibling.remove();
              }
              wrapperSpan.appendChild(span.cloneNode(true));
              if (index < spansToWrap.length - 1) {
                wrapperSpan.appendChild(document.createTextNode(" "));
              }
            });

            if (spansToWrap.length > 0) {
              parentP.insertBefore(wrapperSpan, spansToWrap[0]);
            }

            spansToWrap.forEach((span) => {
              span.remove();
            });
          });

          this.registerComponent("answer-inputs", INPUT_SELECTOR);
        },
      },
      "answer-inputs": {
        effects: function effects(el, i) {},
      },
      "validate-button": {
        effects: function effects(el) {
          el.setAttribute("disabled", true);
          el.textContent = "Key"; // el.blur();
        },
      },
      "reset-button": {
        effects: function effects(el) {
          // el.focus();
        },
      },
    },
  },
};

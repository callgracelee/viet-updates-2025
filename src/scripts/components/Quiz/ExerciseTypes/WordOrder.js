import {
  INITIAL,
  TOUCHED,
  VALIDATED_CORRECT,
  VALIDATED_INCORRECT,
  // VALIDATED_WITH_ANSWERS,
  SHOWING_ANSWERS_ONLY,
  INPUT_SELECTOR,
  RESET_CONTROL_SELECTOR,
  VALIDATE_CONTROL_SELECTOR,
  ANSWER_SLOT_SELECTOR,
  DATA_TOGGLED_ATTRIBUTE,
  DATA_CORRECT_ATTRIBUTE,
  DATA_INCORRECT_ATTRIBUTE,
  DATA_SLOT_ACTIVE_ATTRIBUTE,
} from "../constants";

export const WordOrder = {
  before() {
    this.originalSlotText = [];
    this.components["answer-slot"].nodes.forEach(function(slot) {
      this.originalSlotText.push(slot.textContent);
    }, this);

    this.generatePossibleAnswerKeys = function(duplicates, answerArray) {
      const possibleAnswerKeys = new Set(); // Using a Set to avoid duplicates
      possibleAnswerKeys.add(answerArray.join(",")); // Add the original key to the set

      function swapDuplicatesRecursively(currentAnswerArray, currentIndex) {
        // Base case: if we have processed all duplicate groups, stop recursion
        if (currentIndex >= duplicates.length) {
          possibleAnswerKeys.add(currentAnswerArray.join(","));
          return;
        }

        const [val1, val2] = duplicates[currentIndex]; // The duplicate values (not indices)

        const index1 = currentAnswerArray.indexOf(val1);
        const index2 = currentAnswerArray.indexOf(val2);

        if (index1 !== -1 && index2 !== -1) {
          // Swap values and create a new array
          const newAnswerArray = [...currentAnswerArray];
          newAnswerArray[index1] = val2;
          newAnswerArray[index2] = val1;

          // Recursively swap the next group with the newly swapped array
          swapDuplicatesRecursively(newAnswerArray, currentIndex + 1);
        }

        // Proceed without swapping the current group (to handle combinations of swaps)
        swapDuplicatesRecursively(currentAnswerArray, currentIndex + 1);
      }

      // Start recursion from the first duplicate group
      swapDuplicatesRecursively(answerArray, 0);

      return Array.from(possibleAnswerKeys); // Convert set back to array
    };

    this.possibleAnswerKeys;
  },
  reset() {
    this.setState({
      name: "INITIAL",
      responses: Array(this.answerKey.split(",").length).fill(null),
      currentSlot: 0,
    });
  },
  getResponseKey() {
    return this.state.responses.join(",");
  },

  compare() {
    // const responseKey = this.getResponseKey();
    const answerInputTexts = this.components["answer-inputs"].nodes.map((node) => node.textContent.trim());

    // Find duplicated texts and their indices
    const textToIndicesMap = {};
    answerInputTexts.forEach((text, index) => {
      if (!textToIndicesMap[text]) {
        textToIndicesMap[text] = [];
      }
      textToIndicesMap[text].push(index);
    });

    // Filter to find only duplicated texts and their indices
    const duplicatedAnswerInputTextsIndices = Object.values(textToIndicesMap).filter((indices) => indices.length > 1);
    // [[0,3], [1,2]]
    const answerArray = this.answerKey.split(",").map(Number);
    // [2,1,0,3]
    // let possibleAnswerKeys;

    // If there are duplicates, generate possible answer keys
    if (duplicatedAnswerInputTextsIndices.length > 0) {
      this.possibleAnswerKeys = this.generatePossibleAnswerKeys(duplicatedAnswerInputTextsIndices, answerArray);
    } else {
      // If no duplicates, just compare the response with the original answer key
      this.possibleAnswerKeys = [this.answerKey];
    }

    return this.possibleAnswerKeys.includes(this.getResponseKey());
  },

  components: {
    "validate-button": VALIDATE_CONTROL_SELECTOR,
    "reset-button": RESET_CONTROL_SELECTOR,
    "answer-inputs": INPUT_SELECTOR,
    "answer-slot": ANSWER_SLOT_SELECTOR,
  },
  transitions: {
    [INITIAL]: {
      "answer-slot": {
        effects(el, i) {
          el.disabled = false;
          // reset
          el.removeAttribute(DATA_CORRECT_ATTRIBUTE);
          el.removeAttribute(DATA_INCORRECT_ATTRIBUTE);

          el.textContent = this.originalSlotText[i];
          // set the first slot as active
          if (i === this.state.currentSlot) {
            el.setAttribute(DATA_SLOT_ACTIVE_ATTRIBUTE, true);
          } else {
            el.removeAttribute(DATA_SLOT_ACTIVE_ATTRIBUTE);
          }
        },
        handlers: {
          click(e, targetIndex) {
            this.setState({
              currentSlot: targetIndex,
            });
          },
        },
      },
      "answer-inputs": {
        effects(el) {
          el.disabled = false;
          el.removeAttribute(DATA_TOGGLED_ATTRIBUTE);
          el.removeAttribute(DATA_CORRECT_ATTRIBUTE);
          el.removeAttribute(DATA_INCORRECT_ATTRIBUTE);
        },
        handlers: {
          click(e, targetIndex) {
            const responses = [].concat(this.state.responses);
            // if it already exists in responses
            const matchingIndex = responses.indexOf(targetIndex);
            if (matchingIndex === -1) {
              responses[this.state.currentSlot] = targetIndex;
            } else {
              responses.splice(matchingIndex, 1);
            }

            // automatically increment the currentSlot
            // const incrementedCurrentSlot =
            //   this.state.currentSlot < this.state.responses.length - 1
            //     ? this.state.currentSlot + 1
            //     : 0;

            // Increment the currentSlot and find the next empty slot
            let incrementedCurrentSlot = this.state.currentSlot;

            do {
              incrementedCurrentSlot = incrementedCurrentSlot < this.state.responses.length - 1 ? incrementedCurrentSlot + 1 : 0;
            } while (incrementedCurrentSlot !== this.state.currentSlot && this.components["answer-slot"].nodes[incrementedCurrentSlot].textContent);

            this.setState({
              name: TOUCHED,
              responses,
              currentSlot: incrementedCurrentSlot,
            });
          },
        },
      },
    },
    [TOUCHED]: {
      "answer-slot": {
        effects(el, i) {
          if (this.state.responses[i] || this.state.responses[i] === 0) {
            el.textContent = this.components["answer-inputs"].nodes[this.state.responses[i]].textContent;
          } else {
            el.textContent = this.originalSlotText[i];
          }

          if (i === this.state.currentSlot) {
            el.setAttribute(DATA_SLOT_ACTIVE_ATTRIBUTE, true);
          } else {
            el.removeAttribute(DATA_SLOT_ACTIVE_ATTRIBUTE);
          }
        },
        handlers: {
          click(e, targetIndex) {
            const responses = [...this.state.responses];
            responses[targetIndex] = null;
            this.setState({
              currentSlot: targetIndex,
              responses,
            });
          },
        },
      },
      "answer-inputs": {
        effects(el, i) {
          const isToggled = this.state.responses.indexOf(i);
          if (isToggled === -1) {
            el.removeAttribute(DATA_TOGGLED_ATTRIBUTE);
            el.removeAttribute("disabled");
          } else {
            el.setAttribute(DATA_TOGGLED_ATTRIBUTE, true);
            el.setAttribute("disabled", true);
          }
        },
      },
      handlers: {
        click(e, targetIndex) {
          const responses = [].concat(this.state.responses);
          // if it already exists in responses
          const matchingIndex = responses.indexOf(targetIndex);
          if (matchingIndex === -1) {
            responses[this.state.currentSlot] = targetIndex;
          } else {
            responses.splice(matchingIndex, 1);
          }

          // automatically increment the currentSlot
          const incrementedCurrentSlot = this.state.currentSlot < this.state.responses.length - 1 ? this.state.currentSlot + 1 : 0;

          this.setState({
            name: TOUCHED,
            responses,
            currentSlot: incrementedCurrentSlot,
          });
        },
      },
    },
    [VALIDATED_CORRECT]: {
      "answer-slot": {
        effects(el, i) {
          el.textContent = this.components["answer-inputs"].nodes[this.state.responses[i]].textContent;
          el.setAttribute(DATA_CORRECT_ATTRIBUTE, true);
          el.removeAttribute(DATA_SLOT_ACTIVE_ATTRIBUTE);
          el.setAttribute("disabled", true);
        },
      },
      "answer-inputs": {
        effects(el) {
          el.setAttribute("disabled", true);
        },
      },
      "validate-button": {
        effects(el) {
          el.setAttribute("disabled", true);
          el.innerHTML = "Key";
        },
      },
      "reset-button": {
        effects(el) {
          el.removeAttribute("disabled");
        },
        handlers: {
          click() {
            this.reset();
          },
        },
      },
    },
    [VALIDATED_INCORRECT]: {
      "answer-slot": {
        effects(el, i) {
          console.log("el", el);
          console.log("i", i);
          console.log("this.state.responses[i]", this.state.responses[i]);

          const toggled = this.state.responses[i] || this.state.responses[i] == 0;
          if (toggled) {
            el.textContent = this.components["answer-inputs"].nodes[this.state.responses[i]].textContent;
          }

          //Fetch possible answer keys and split them for checking the current slot
          const possibleAnswerKeys = this.possibleAnswerKeys || [];
          const isCorrectForThisSlot = possibleAnswerKeys.some((answerKey) => {
            const answerArray = answerKey.split(",");
            return answerArray[i] == this.state.responses[i];
          });

          if (toggled && isCorrectForThisSlot) {
            el.setAttribute(DATA_CORRECT_ATTRIBUTE, true);
          }
          if (toggled && !isCorrectForThisSlot) {
            el.setAttribute(DATA_INCORRECT_ATTRIBUTE, true);
          }
          el.removeAttribute(DATA_SLOT_ACTIVE_ATTRIBUTE);
          el.setAttribute("disabled", true);
        },
      },
      "answer-inputs": {
        effects(el, i) {
          // disabled inputs
          el.setAttribute("disabled", true);
          const isToggled = this.state.responses.indexOf(i);
          if (isToggled === -1) {
            el.removeAttribute(DATA_TOGGLED_ATTRIBUTE);
          } else {
            el.setAttribute(DATA_TOGGLED_ATTRIBUTE, true);
          }
        },
      },
      "validate-button": {
        effects(el) {
          el.disabled = false;
          el.textContent = "Key";
        },
        handlers: {
          click(e) {
            this.setState({
              name: SHOWING_ANSWERS_ONLY,
            });
          },
        },
      },
      "reset-button": {
        click() {
          this.reset();
        },
      },
    },
    [SHOWING_ANSWERS_ONLY]: {
      "answer-slot": {
        effects(el, i) {
          const correctAnswer = this.answerKey.split(",")[i];
          el.removeAttribute(DATA_INCORRECT_ATTRIBUTE);
          el.removeAttribute(DATA_CORRECT_ATTRIBUTE);
          el.textContent = this.components["answer-inputs"].nodes[correctAnswer].textContent;
          el.setAttribute("disabled", true);
          el.removeAttribute(DATA_SLOT_ACTIVE_ATTRIBUTE);
        },
      },
    },
  },
};

/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-plusplus */
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

export const MatchPairs = {
  before() {
    this.originalSlotText = [];
    this.components["answer-slot"].nodes.forEach(function(slot) {
      this.originalSlotText.push(slot.textContent);
    }, this);

    // match pairs helpers
    function chunkArray(arr, size) {
      const chunks = [];
      let currentChunk = [];
      let chunkIndex = 0;
      for (let i = 0; i < arr.length; i++) {
        currentChunk.push(arr[i]);
        chunkIndex++;
        if (chunkIndex === size || arr.length - i === 1) {
          chunks.push(currentChunk);
          currentChunk = [];
          chunkIndex = 0;
        }
      }
      return chunks;
    }

    this.chunkArray = chunkArray;

    this.chunkSortAndFlatten = function chunkSortAndFlatten(str) {
      return chunkArray(str.split(","), 2)
        .map((arr) => arr.sort())
        .sort()
        .map((arr) => arr.join(","))
        .join(",");
    };

    this.answerMap = this.answerKey
      .split(",")
      .map(Number)
      .reduce((acc, curr, i, arr) => {
        const isEven = i % 2 === 0;
        const delta = isEven ? 1 : -1;
        const match = arr[i + delta];
        acc[curr] = match;
        return acc;
      }, {});

    this.getValidationMap = function() {
      return this.state.responses.map(function(response, i, arr) {
        const isEven = i % 2 === 0;
        const delta = isEven ? 1 : -1;
        const match = arr[i + delta];
        return {
          self: response,
          match: this.answerMap[response],
          isCorrect: this.answerMap[response] === match,
        };
      }, this);
    };
  },
  reset() {
    this.setState({
      name: "INITIAL",
      responses: Array(this.answerKey.split(",").length).fill(null),
      currentSlot: 0,
    });
  },
  compare() {
    const responseKey = this.getResponseKey();
    return (
      this.chunkSortAndFlatten(responseKey) ===
      this.chunkSortAndFlatten(this.answerKey)
    );
  },
  getResponseKey() {
    return this.state.responses.join(",");
  },
  update() {
    // console.log("update word order....");
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
          // reset
          this.validationMap = null;
          this.previousMatches = null;
          this.pair = null;

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
            const incrementedCurrentSlot =
              this.state.currentSlot < this.state.responses.length - 1
                ? this.state.currentSlot + 1
                : 0;

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
          const toggled =
            this.state.responses[i] || this.state.responses[i] === 0;
          if (toggled) {
            el.textContent = this.components["answer-inputs"].nodes[
              this.state.responses[i]
            ].textContent;
          }

          if (i === this.state.currentSlot) {
            el.setAttribute(DATA_SLOT_ACTIVE_ATTRIBUTE, true);
          } else {
            el.removeAttribute(DATA_SLOT_ACTIVE_ATTRIBUTE);
          }
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
    },
    [VALIDATED_CORRECT]: {
      "answer-slot": {
        effects(el, i) {
          el.textContent = this.components["answer-inputs"].nodes[
            this.state.responses[i]
          ].textContent;
          el.setAttribute("disabled", true);
          el.setAttribute(DATA_CORRECT_ATTRIBUTE, true);
        },
      },
      "answer-inputs": {
        effects(el) {
          el.setAttribute("disabled", true);
        },
      },
    },
    [VALIDATED_INCORRECT]: {
      "answer-slot": {
        effects(el, i) {
          // set the validation map the first time
          if (!this.validationMap) {
            this.validationMap = this.getValidationMap();
            // console.log(this.validationMap);
          }
          const toggled =
            this.state.responses[i] || this.state.responses[i] === 0;
          if (toggled) {
            el.textContent = this.components["answer-inputs"].nodes[
              this.state.responses[i]
            ].textContent;
          }

          if (this.validationMap[i].isCorrect) {
            el.setAttribute(DATA_CORRECT_ATTRIBUTE, true);
          } else {
            el.setAttribute(DATA_INCORRECT_ATTRIBUTE, true);
          }
        },
      },
      "answer-inputs": {
        effects(el, i) {
          // disable inputs
          el.setAttribute("disabled", true);
        },
      },
      "validate-button": {
        effects(el) {
          el.disabled = false;
          el.textContent = "Compare";
        },
        handlers: {
          click(e) {
            this.setState({
              name: SHOWING_ANSWERS_ONLY,
            });
          },
        },
      },
    },
    [SHOWING_ANSWERS_ONLY]: {
      "answer-slot": {
        effects(el, i) {
          const correctAnswer = this.answerKey.split(",")[i];
          el.removeAttribute(DATA_INCORRECT_ATTRIBUTE);
          el.removeAttribute(DATA_CORRECT_ATTRIBUTE);
          el.textContent = this.components["answer-inputs"].nodes[
            correctAnswer
          ].textContent;
        },
      },
    },
  },
};

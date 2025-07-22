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
  DATA_TOGGLED_ATTRIBUTE,
  DATA_CORRECT_ATTRIBUTE,
  DATA_INCORRECT_ATTRIBUTE,
  DATA_EXERCISE_CORRECT,
} from "../constants";

/* =============================================
=            UI: default type            =
============================================= */

export const defaultType = {
  before() {},
  reset() {
    this.setState({
      name: "INITIAL",
      responses: [],
    });
  },
  compare() {
    const responseKey = this.getResponseKey();
    return (
      responseKey ===
      this.answerKey
        .split(",")
        .sort()
        .join(",")
    );
  },
  getResponseKey() {
    return this.state.responses.sort().join(",");
  },
  update() {
    // console.log("update select many....");
  },
  components: {
    "validate-button": VALIDATE_CONTROL_SELECTOR,
    "reset-button": RESET_CONTROL_SELECTOR,
    "answer-inputs": INPUT_SELECTOR,
  },
  transitions: {
    [INITIAL]: {
      exercise: {
        effects(el) {
          el.removeAttribute(DATA_EXERCISE_CORRECT);
        },
      },
      "validate-button": {
        effects(el) {
          el.textContent = "Check";
          el.setAttribute("disabled", true);
        },
      },
      "reset-button": {
        effects(el) {
          el.setAttribute("disabled", true);
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
              responses.push(targetIndex);
            } else {
              responses.splice(matchingIndex, 1);
            }
            this.setState({
              name: TOUCHED,
              responses,
            });
          },
        },
      },
    },
    [TOUCHED]: {
      "validate-button": {
        effects(el) {
          el.disabled = false;
        },
        handlers: {
          click(e) {
            // handle check
            const isCorrect = this.compare();
            if (isCorrect) {
              this.setState({
                name: VALIDATED_CORRECT,
                responses: this.state.responses,
                attempts: (this.state.attempts || 0) + 1,
              });
            } else {
              this.setState({
                name: VALIDATED_INCORRECT,
                responses: this.state.responses,
                attempts: (this.state.attempts || 0) + 1,
              });
            }
          },
        },
      },
      "reset-button": {
        effects(el) {
          el.disabled = false;
        },
        handlers: {
          click(e) {
            this.reset();
          },
        },
      },
      "answer-inputs": {
        effects(el, i) {
          const isToggled = this.state.responses.indexOf(i);
          if (isToggled === -1) {
            el.removeAttribute(DATA_TOGGLED_ATTRIBUTE);
          } else {
            el.setAttribute(DATA_TOGGLED_ATTRIBUTE, true);
          }
        },
      },
    },
    [VALIDATED_CORRECT]: {
      exercise: {
        effects(el) {
          el.setAttribute(DATA_EXERCISE_CORRECT, true);
        },
      },
      "answer-inputs": {
        effects(el, i) {
          el.setAttribute("disabled", true);
          const shouldBeToggled = this.state.responses.indexOf(i) > -1;
          if (shouldBeToggled) {
            el.setAttribute(DATA_TOGGLED_ATTRIBUTE, true);
          }
          if (el.dataset.toggled) {
            el.setAttribute(DATA_CORRECT_ATTRIBUTE, true);
          }
        },
      },
      "validate-button": {
        effects(el) {
          el.setAttribute("disabled", true);
          el.innerHTML = "Key";
          // el.innerHTML = "Correct!";
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
      exercise: {
        effects(el) {
          el.setAttribute(DATA_EXERCISE_CORRECT, false);
        },
      },
      "answer-inputs": {
        effects(el, i) {
          // disabled inputs
          el.setAttribute("disabled", true);
          const shouldBeCorrect =
            this.answerKey
              .split(",")
              .map(Number)
              .indexOf(i) > -1;
          const shouldBeToggled = this.state.responses.indexOf(i) > -1;
          if (shouldBeToggled) {
            el.setAttribute(DATA_TOGGLED_ATTRIBUTE, true);
          }
          const { toggled } = el.dataset;
          if (toggled && shouldBeCorrect) {
            el.setAttribute(DATA_CORRECT_ATTRIBUTE, true);
          }
          // if ((toggled && !shouldBeCorrect) || (shouldBeCorrect && !toggled)) {
          //   el.setAttribute(DATA_INCORRECT_ATTRIBUTE, true);
          // }
          if (toggled && !shouldBeCorrect) {
            el.setAttribute(DATA_INCORRECT_ATTRIBUTE, true);
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
        effects(el) {
          el.disabled = false;
        },
        handlers: {
          click() {
            this.reset();
          },
        },
      },
    },
    [SHOWING_ANSWERS_ONLY]: {
      "answer-inputs": {
        effects(el, i) {
          // remove validations
          el.removeAttribute(DATA_CORRECT_ATTRIBUTE);
          el.removeAttribute(DATA_INCORRECT_ATTRIBUTE);

          const shouldBeCorrect =
            this.answerKey
              .split(",")
              .map(Number)
              .indexOf(i) > -1;
          if (shouldBeCorrect) {
            el.setAttribute(DATA_TOGGLED_ATTRIBUTE, true);
          } else {
            el.removeAttribute(DATA_TOGGLED_ATTRIBUTE);
          }
        },
      },
      "validate-button": {
        effects(el) {
          el.setAttribute("disabled", true);
          el.textContent = "Key";
          // el.blur();
        },
      },
      "reset-button": {
        effects(el) {
          // el.focus();
        },
      },
    },
  },
};

/* =====  End of default type  ====== */

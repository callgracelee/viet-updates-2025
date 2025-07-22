/* eslint-disable react/no-access-state-in-setstate */
import { diffChars } from "diff";
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
} from "../constants";

/* WriteInOpenEnded */
export const WriteIn = {
  before() {
    var _this = this;
    this.normalizeNFC = (str) => {
      if (!String.prototype.normalize) {
        return str;
      }
      return str.normalize("NFC");
    };

    this.normalizeString = function(str) {
      // uncomment below to ignore punctuation in the validation
      // const punctRE = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g;
      var spaceRE = /\s+/g; // make sure the first letter is always lowercase

      if (str.length > 0) {
        // eslint-disable-next-line no-param-reassign
        str = str[0].toLowerCase() + str.slice(1);
      }

      return (
        _this
          .normalizeNFC(str) // uncomment to ignore punctuation in the validation
          // .replace(punctRE, '')
          // .replace(/[\u0300-\u036f]/g, '')
          .replace(spaceRE, "")
      ); // .toLowerCase();
    };
  },
  reset() {
    this.setState({
      name: "INITIAL",
      responses: "",
    });
  },
  compare() {
    const responseKey = this.getResponseKey();
    console.log(typeof this.answerKey);
    return (
      this.normalizeString(responseKey) === this.normalizeString(this.answerKey)
    );
  },

  getResponseKey() {
    return this.state.responses;
  },
  components: {
    "validate-button": VALIDATE_CONTROL_SELECTOR,
    "reset-button": RESET_CONTROL_SELECTOR,
    "answer-inputs": INPUT_SELECTOR,
    "validate-message": "[data-validate-message]",
  },
  transitions: {
    [INITIAL]: {
      "validate-message": {
        effects: function effects(el) {
          el.textContent = "";
        },
      },
      "answer-inputs": {
        effects(el) {
          el.textContent = "";
          // el.disabled = false;

          // setTimeout(() => {
          //   if (el.disabled || !el.contenteditable) {
          //     el.removeAttribute("disabled");
          //     el.setAttribute("contenteditable", true);
          //   }
          // }, 100);

          // el.removeAttribute(DATA_TOGGLED_ATTRIBUTE);
          // el.removeAttribute(DATA_CORRECT_ATTRIBUTE);
          // el.removeAttribute(DATA_INCORRECT_ATTRIBUTE);
        },
        handlers: {
          click() {
            this.setState({
              name: TOUCHED,
            });
          },
        },
      },
      "validate-button": {
        effects(el) {
          el.textContent = "Check";
          el.setAttribute("disabled", true);
          // el.removeAttribute("disabled");
        },
        handlers: {
          click(e) {
            // this.setState({
            //   name: TOUCHED,
            //   responses:
            //     this.components["answer-inputs"].nodes[0].textContent || "",
            // });
            // const isCorrect = this.compare();
            // if (isCorrect) {
            //   this.setState({
            //     name: VALIDATED_CORRECT,
            //     responses: this.answerKey,
            //     attempts: (this.state.attempts || 0) + 1,
            //   });
            // } else {
            //   this.setState({
            //     name: VALIDATED_INCORRECT,
            //     responses: this.state.responses,
            //     attempts: (this.state.attempts || 0) + 1,
            //   });
            // }
          },
        },
      },
    },
    [TOUCHED]: {
      "validate-button": {
        handlers: {
          click(e) {
            this.setState({
              name: TOUCHED,
              responses:
                this.components["answer-inputs"].nodes[0].textContent || "",
            });
            const isCorrect = this.compare();
            if (isCorrect) {
              this.setState({
                name: VALIDATED_CORRECT,
                responses: this.answerKey,
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
      "answer-inputs": {
        effects(el, i) {
          setTimeout(() => {
            if (el.disabled || !el.contenteditable) {
              el.removeAttribute("disabled");
              el.setAttribute("contenteditable", true);
            }
          }, 100);
          el.setAttribute(DATA_TOGGLED_ATTRIBUTE, true);
        },
        handlers: {
          click() {
            return false;
          },
        },
      },
    },
    [VALIDATED_CORRECT]: {
      "validate-message": {
        effects: function effects(el, i) {
          console.log("VALIDATED_CORRECT");
          var answerKeyArray = this.answerKey
            .split(/\], \[|\[|\]/)
            .filter(Boolean);
          el.innerHTML = `<em>Suggested Answer: ${answerKeyArray[i]}</em>`;
        },
      },
      "answer-inputs": {
        effects(el, i) {
          // el.textContent = this.state.responses;
          el.removeAttribute(DATA_TOGGLED_ATTRIBUTE);
          el.setAttribute("disabled", true);
          el.removeAttribute("contenteditable");
          // el.setAttribute(DATA_CORRECT_ATTRIBUTE, true);
        },
      },
      "validate-button": {
        effects: function effects(el) {
          el.setAttribute("disabled", true);
          el.textContent = "Key";
        },

        handlers: {
          click: function click(e) {
            this.setState({
              name: SHOWING_ANSWERS_ONLY,
            });
          },
        },
      },
    },
    [VALIDATED_INCORRECT]: {
      "validate-message": {
        effects: function effects(el, i) {
          console.log("VALIDATED_INCORRECT");
          var answerKeyArray = this.answerKey
            .split(/\], \[|\[|\]/)
            .filter(Boolean);
          el.innerHTML = `<em>Suggested Answer: ${answerKeyArray[i]}</em>`;
        },
      },
      "answer-inputs": {
        effects(el, i) {
          // el.textContent = this.state.responses;
          // disabled inputs
          el.removeAttribute(DATA_TOGGLED_ATTRIBUTE);
          el.setAttribute("disabled", true);
          el.removeAttribute("contenteditable");
          // el.setAttribute(DATA_INCORRECT_ATTRIBUTE, true);
        },
      },
      "validate-button": {
        effects: function effects(el) {
          el.setAttribute("disabled", true);
          el.textContent = "Key";
        },

        handlers: {
          click: function click(e) {
            this.setState({
              name: SHOWING_ANSWERS_ONLY,
            });
          },
        },
      },
    },
    [SHOWING_ANSWERS_ONLY]: {
      "validate-message": {
        effects: function effects(el) {
          console.log(el);
          el.innerHTML = `<em>Suggested Answer: ${answerKeyArray[i]}</em>`;
        },
      },
      "answer-inputs": {
        effects(el, i) {
          // el.textContent = this.answerKey;
          el.removeAttribute(DATA_TOGGLED_ATTRIBUTE);
          el.setAttribute("disabled", true);
          el.removeAttribute(DATA_INCORRECT_ATTRIBUTE);
          // el.removeAttribute("contenteditable");
        },
      },
      "validate-button": {
        effects(el) {
          el.setAttribute("disabled", true);
          el.textContent = "Key";
        },
      },
    },
  },
};

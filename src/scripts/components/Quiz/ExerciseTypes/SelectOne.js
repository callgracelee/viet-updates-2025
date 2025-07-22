import {
  INITIAL,
  SHOWING_ANSWERS_ONLY,
  TOUCHED,
  VALIDATED_INCORRECT,
  // VALIDATED_WITH_ANSWERS,
} from "../constants";

/**
 *
 * select-one, example: true or false
 *
 */

export const SelectOne = {
  transitions: {
    [INITIAL]: {
      "answer-inputs": {
        handlers: {
          click(e, targetIndex) {
            const responses = [];
            // if it already exists in responses
            const matchingIndex = responses.indexOf(targetIndex);
            if (matchingIndex === -1) {
              responses.push(targetIndex);
            }

            this.setState({
              name: TOUCHED,
              responses,
            });
          },
        },
      },
    },
    [VALIDATED_INCORRECT]: {
      "validate-button": {
        effects(el) {
          el.textContent = "Key";
          el.disabled = false;
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
  },
};

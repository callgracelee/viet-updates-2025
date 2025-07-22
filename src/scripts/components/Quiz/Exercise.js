// data-type, data-key, data-answer rely on dataset functionality and are therefore hard-coded
function Input(name, selector, parentNode) {
  this.name = name;
  this.selector = selector;
  const nodes = parentNode.querySelectorAll(selector);
  this.nodes = Array.prototype.slice.call(nodes);
}

export class Exercise {
  constructor(node, context, options) {
    this.node = node;
    this.options = options;
    this.context = context;
    this.type = node.dataset.type;
    this.key = node.dataset.key;
    this.answerKey = node.dataset.answer;
    this.state = {};
    this.eventHandlers = {};
    this.listeners = {};
    this.components = {};
    this.transitions = context.types[this.type].transitions;
    this.init = function() {
      this.context.beforeEach.call(this);
    };
    this.init();
  }

  // dynamically register listeners with event delegation
  registerListener(type) {
    this.listeners[type] = function(e) {
      const match = Object.keys(this.eventHandlers).filter(key =>
        e.target.matches(key)
      );
      if (match.length === 0 || !this.eventHandlers[match[0]][type]) return;
      const collection = this.node.querySelectorAll(match[0]);
      const targetIndex = Array.prototype.indexOf.call(collection, e.target);
      this.eventHandlers[match[0]][type].call(this, e, targetIndex, collection);
      e.preventDefault();
    }.bind(this);

    this.node.addEventListener(type, this.listeners[type], false);
  }

  registerEventHandler(selector, type, callback) {
    if (!this.listeners[type]) {
      this.registerListener(type);
    }
    this.eventHandlers[selector] = {};
    this.eventHandlers[selector][type] = callback.bind(this);
  }

  registerComponent(name, selector) {
    this.components[name] = new Input(name, selector, this.node);
  }

  registerComponents() {
    const { components } = this.context.types[this.type];

    Object.keys(components).forEach(function(component) {
      this.registerComponent(component, components[component]);
    }, this);
  }

  // warning: no deep state
  setState(update) {
    // update state
    const prevState = Object.assign({}, this.state);
    const newState = Object.assign(prevState, update);
    this.state = newState;

    // handle side effects
    const tansition = this.transitions[this.state.name];
    if (tansition) {
      Object.keys(tansition).forEach(function(componentKey) {
        const { effects } = tansition[componentKey];
        const { handlers } = tansition[componentKey];

        // execute effects from transitions
        if (effects) {
          if (this.components[componentKey]) {
            this.components[componentKey].nodes.forEach(effects, this);
          }
          // set effects on the exercise node itself
          if (componentKey === 'exercise') {
            effects(this.node);
          }
        }
        // register handlers from transitions
        if (handlers) {
          Object.keys(handlers).forEach(function(type) {
            this.registerEventHandler(
              this.components[componentKey].selector,
              type,
              handlers[type]
            );
          }, this);
        }
      }, this);
    }

    // call global update
    this.context.update.call(this, {
      key: this.key,
      state: this.state,
    });
  }
}

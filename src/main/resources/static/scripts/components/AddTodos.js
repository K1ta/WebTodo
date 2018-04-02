var extendConstructor = require('../utils/extendConstructor');
var Eventable = require('../modules/Eventable');

var ENTER_KEY_CODE = 13;

var TODOS_TODO_INPUT_SELECTOR = '.todos-add_new-element';
var TODOS_SELECT_ALL_SELECTOR = '.todos-add_select-all';

/**
 * @implements {EventListener}
 * @extends {Eventable}
 * @constructor
 */
function AddTodosConstructor() {
    this._todoInput = document.querySelector(TODOS_TODO_INPUT_SELECTOR);
    this._todoSelectAll = document.querySelector(TODOS_SELECT_ALL_SELECTOR);

    this._todoInput.addEventListener('keypress', this);
    this._todoInput.addEventListener('focus', this);
    this._todoInput.addEventListener('blur', this);
    this._todoSelectAll.addEventListener('click', this);

    this._initEventable();
}

extendConstructor(AddTodosConstructor, Eventable);

var addTodosConstructorPrototype = AddTodosConstructor.prototype;

addTodosConstructorPrototype._markAsReadyAll = function () {
    return this.trigger('markAsReadyAll');
};

addTodosConstructorPrototype._addItem = function () {
    var todoInputValue = this._todoInput.value.trim()

    if (todoInputValue.length !== 0) {
        this._todoInput.value = '';
    } else {
        return this;
    }

    return this.trigger('newTodo', {
        text: todoInputValue
    });
};

addTodosConstructorPrototype.handleEvent = function (e) {
    switch (e.type) {
        case 'click':
            this._markAsReadyAll();
            break;
        case 'keypress':
            if (e.keyCode === ENTER_KEY_CODE) {
                this._addItem();
            }
            break;
        case 'focus':
            this.trigger('focus');
            break;
        case 'blur':
            this.trigger('blur');
            break;
    }
};

module.exports = AddTodosConstructor;
var extendConstructor = require('../utils/extendConstructor');
var getTextNode = require('../utils/getTextNode');
var Eventable = require('../modules/Eventable');
var Filter = require('./Filter');

/**
 * @constructor
 * @implements {EventListener}
 */
function TodoActionsBarConstructor() {
    this._initEventable();

    this._counterNode = document.querySelector('.todos-action-bar_undone-counter');
    this._counterNodeText = getTextNode(this._counterNode);
    this._clearCompletedNode = document.querySelector('.todos-action-bar_clear-completed');

    this._clearCompletedNode.addEventListener('click', this);

    this._filters = new Filter(document.querySelector('.todos_filters'));

    this._filters.on('filterSelected', this._onFilterSelected, this);
}

extendConstructor(TodoActionsBarConstructor, Eventable);

var todoActionsBarConstructorPrototype = TodoActionsBarConstructor.prototype;

todoActionsBarConstructorPrototype._onFilterSelected = function (filterId) {
    this.trigger('filterSelected', filterId);
};

/**
 * @return {TodoActionsBarConstructor}
 * @private
 */
todoActionsBarConstructorPrototype._clearCompleted = function () {
    this.trigger('clearCompleted');
    return this;
};

/**
 * @param {Number} count
 * @return {TodoActionsBarConstructor}
 */
todoActionsBarConstructorPrototype.setItemsCount = function (count) {
    this._counterNodeText.nodeValue = count + ' ' + 'items left';
    return this;
};

/**
 * @param {Event} e
 */
todoActionsBarConstructorPrototype.handleEvent = function (e) {
    switch (e.type) {
        case 'click':
            this._clearCompleted();
            break;
    }
};

todoActionsBarConstructorPrototype.hideTemporally = function () {
    this._counterNode.classList.add('__hide-temporally');
    this._clearCompletedNode.classList.add('__hide-temporally');
};
todoActionsBarConstructorPrototype.showTemporally = function () {
    this._counterNode.classList.remove('__hide-temporally');
    this._clearCompletedNode.classList.remove('__hide-temporally');
};

module.exports = TodoActionsBarConstructor;
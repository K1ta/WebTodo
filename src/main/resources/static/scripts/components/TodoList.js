var Eventable = require('../modules/Eventable');
var extendConstructor = require('../utils/extendConstructor');

var TodoItem = require('./TodoItem');

var TODO_LIST_SELECTOR = '.todos-list';
var itemsIdIterator = 0;

/**
 * @extends {Eventable}
 * @constructor
 */
function TodoListConstructor() {
    /**
     * @type {Array.<TodoItemConstructor>}
     * @private
     */
    this._items = [];
    this._todosList = document.querySelector(TODO_LIST_SELECTOR);
    this._currentFilter = 'all';

    this._itemsLeft = 0;

    this._initEventable();
}

extendConstructor(TodoListConstructor, Eventable);

var todoListConstructorPrototype = TodoListConstructor.prototype;

/**
 * @return {Number}
 */
todoListConstructorPrototype.getActiveItemsCount = function () {
    //return this._items.length;
    var items = this._items;
    var i = items.length;

    var left = 0;

    for (; i--;) {
        if (!items[i].model.isReady) {
            left++;
        }
    }
    return left;
};

/**
 * @return {Number}
 */
todoListConstructorPrototype.getAllItemsCount = function () {
    return this._items.length;
};

/**
 * @param {Object} todoItemData
 * @return {TodoListConstructor}
 */
todoListConstructorPrototype.createItem = function (todoItemData) {
    var id = 0;
    if (typeof todoItemData.id !== 'undefined') {
        id = todoItemData.id;
        if (todoItemData.id > itemsIdIterator) {
            itemsIdIterator = todoItemData.id;
        }
    } else {
        id = ++itemsIdIterator;
        //undefined id means element that is not in db yet
        //saving in db
        var xhr = new XMLHttpRequest();
        xhr.open('POST', document.location.href + 'api/add', true);
        xhr.setRequestHeader('Content-type', 'application/json');
        var savingItem = {
            id: id,
            data: todoItemData.text,
            ready: 'false'
        }
        xhr.send(JSON.stringify(savingItem));
    }
    var item = new TodoItem(
        {
            id: id,
            text: todoItemData.text,
            isReady: todoItemData.isReady
        });

    this._items.push(item);

    item.on('change', this._onItemChange, this)
        .on('remove', this._onItemRemove, this)
        .render(this._todosList);

    this.trigger('itemAdd', item);

    return this;
};

/**
 * @return {TodoListConstructor}
 */
todoListConstructorPrototype.removeCompletedItems = function () {
    var items = this._items;
    var i = items.length;

    for (; i--;) {
        if (items[i].model.isReady) {
            items[i].remove();
        }
    }

    return this;
};

/**
 * @param {Number} itemId
 * @return {TodoItem|null}
 * @private
 */
todoListConstructorPrototype._getItemById = function (itemId) {
    var items = this._items;

    for (var i = items.length; i--;) {
        if (items[i].model.id === itemId) {
            return items[i];
        }
    }

    return null;
};

todoListConstructorPrototype._onItemChange = function (itemModel) {
    //save information about data and state to db
    var xhr = new XMLHttpRequest();
    xhr.open('POST', document.location.href + 'api/update', true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(JSON.stringify({
        id: itemModel.id,
        data: itemModel.text,
        ready: itemModel.isReady
    }));

    this.filterShowedItems(this._currentFilter);
    this.trigger('itemChange', itemModel);
};

todoListConstructorPrototype._onItemRemove = function (itemId) {
    var todoItemComponent = this._getItemById(itemId);

    //removig element from db by id
    var xhr = new XMLHttpRequest();
    xhr.open('POST', document.location.href + 'api/remove', true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(JSON.stringify(todoItemComponent.model.id));

    if (todoItemComponent) {
        todoItemComponent.off('change', this._onItemChange, this);
        todoItemComponent.off('remove', this._onItemRemove, this);
        var todoItemComponentIndex = this._items.indexOf(todoItemComponent);
        this._items.splice(todoItemComponentIndex, 1);
        this.trigger('itemDelete', todoItemComponent.model);
    }

    return this;
};

/**
 * @return {TodoListConstructor}
 */
todoListConstructorPrototype.markAsReadyAll = function () {
    this._items.forEach(function (todoItem) {
        todoItem.setReady(true);
    });
    return this;
};

/**
 * @param {String} filterId
 * @return {TodoListConstructor}
 */
todoListConstructorPrototype.setFilter = function (filterId) {
    this._currentFilter = filterId;
    return this.filterShowedItems(filterId);
};

/**
 * @param {String} filterId
 * @return {TodoListConstructor}
 */
todoListConstructorPrototype.filterShowedItems = function (filterId) {
    this._items.forEach(function (item) {
        switch (filterId) {
            case 'all':
                item.show();
                break;
            case 'ready':
                if (item.model.isReady) {
                    item.show();
                } else {
                    item.hide();
                }
                break;
            case 'unready':
                if (!item.model.isReady) {
                    item.show();
                } else {
                    item.hide();
                }
                break;
        }
    });
    return this;
};

module.exports = TodoListConstructor;
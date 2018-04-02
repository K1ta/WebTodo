var TodoMain = require('./components/TodoMain');
var AddTodos = require('./components/AddTodos');
var TodoList = require('./components/TodoList');
var TodoActionsBar = require('./components/TodoActionBar');

function init() {
    var todoMain = new TodoMain();
    var addTodos = new AddTodos();
    var todoList = new TodoList();
    var todoActionsBar = new TodoActionsBar();

    addTodos
        .on('newTodo',
            function (todoData) {
                todoList.createItem(todoData);
            }
        )
        .on('markAsReadyAll',
            function () {
                todoList.markAsReadyAll();
            }
        )
        .on('focus', function () {
            todoActionsBar.hideTemporally()
        })
        .on('blur', function () {
            todoActionsBar.showTemporally()
        });

    function itemsCountWatcher() {
        var itemsCount = todoList.getActiveItemsCount();

        if (itemsCount !== 0) {
            todoMain.showFullInterface();
        } else if (todoList.getAllItemsCount() === 0) {
            todoMain.hideFullInterface();
        }

        todoActionsBar.setItemsCount(itemsCount);
    }

    todoList.on('itemAdd', itemsCountWatcher)
        .on('itemDelete', itemsCountWatcher)
        .on('itemChange', itemsCountWatcher);

    todoActionsBar.on(
        'clearCompleted',
        function () {
            todoList.removeCompletedItems();
        });

    todoActionsBar.on('filterSelected', function (filterId) {
        todoList.setFilter(filterId);
    });

    //load items
    var xhr = new XMLHttpRequest();
    xhr.open('GET', document.location.href + 'api/all', true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;
        if (xhr.status === 200) {
            var response = xhr.responseText;
            for (var i = 0; i < JSON.parse(response).length; i++) {
                todoList.createItem({
                    id: JSON.parse(xhr.responseText)[i].id,
                    text: JSON.parse(xhr.responseText)[i].data,
                    isReady: JSON.parse(xhr.responseText)[i].ready
                });

            }
        }
    }

}

document.addEventListener('DOMContentLoaded', init);
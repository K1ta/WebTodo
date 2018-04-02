var div = document.createElement('div');

function getTemplateRootNode(scriptId) {
    var scriptTag = document.getElementById(scriptId);
    div.innerHTML = scriptTag.innerHTML;
    var result = div.children[0];
    div.removeChild(result);
    return result;
}

var templatesEngine = {
    todoItem: function (data) {
        var root = getTemplateRootNode('todoItemTemplate');

        var markReady = root.querySelector('.todos-element_mark-checkbox');
        var removeAction = root.querySelector('.todos-element_delete_button');
        var text = root.querySelector('.todos-element_text');

        if (data.text) {
            text.innerText = data.text;
        }

        if (data.isReady) {
            markReady.checked = true;
        }

        return {
            root: root,
            text: text,
            markReady: markReady,
            removeAction: removeAction
        };
    }
};

module.exports = templatesEngine;
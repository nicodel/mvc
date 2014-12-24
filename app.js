/* jshint browser: true, devel: true */
/* exported mvc */

function Event(sender) {
  "use strict";
    this._sender = sender;
    this._listeners = [];
}

Event.prototype = {
    attach: function (listener) {
  "use strict";
        this._listeners.push(listener);
    },
    notify: function (args) {
  "use strict";
        var index;

        for (index = 0; index < this._listeners.length; index += 1) {
            this._listeners[index](this._sender, args);
        }
    }
};
function __remove_childs(parent) {
  "use strict";
  console.log('parent', parent);
  var d = document.getElementById(parent).childNodes;
  console.log('d', d);
  if (d.length !== 0) {
    for (var i = 0; i >= d.length - 1; i++) {
      document.getElementById(parent).removeChild(d[i]);
    }
  }
}
/**
 * The Model. Model stores items and notifies
 * observers about changes.
 */
function ListModel(items) {
  "use strict";
    this._items = items;
    this._selectedIndex = -1;

    this.itemAdded = new Event(this);
    this.itemRemoved = new Event(this);
    this.selectedIndexChanged = new Event(this);
}

ListModel.prototype = {
    getItems: function () {
  "use strict";
        return [].concat(this._items);
    },

    addItem: function (item) {
  "use strict";
        this._items.push(item);
        this.itemAdded.notify({
            item: item
        });
    },

    removeItemAt: function (index) {
  "use strict";
        var item;

        item = this._items[index];
        this._items.splice(index, 1);
        this.itemRemoved.notify({
            item: item
        });
        if (index === this._selectedIndex) {
            this.setSelectedIndex(-1);
        }
    },

    getSelectedIndex: function () {
  "use strict";
        return this._selectedIndex;
    },

    setSelectedIndex: function (index) {
  "use strict";
        var previousIndex;

        previousIndex = this._selectedIndex;
        this._selectedIndex = index;
        this.selectedIndexChanged.notify({
            previous: previousIndex
        });
    }
};

/**
 * The View. View presents the model and provides
 * the UI events. The controller is attached to these
 * events to handle the user interraction.
 */
function ListView(model, elements) {
  "use strict";
    this._model = model;
    this._elements = elements;

    this.listModified = new Event(this);
    this.addButtonClicked = new Event(this);
    this.delButtonClicked = new Event(this);

    var _this = this;

    // attach model listeners
    this._model.itemAdded.attach(function () {
        _this.rebuildList();
    });
    this._model.itemRemoved.attach(function () {
        _this.rebuildList();
    });

    // attach listeners to HTML controls
    this._elements.list.addEventListener('change',  function (e) {
        _this.listModified.notify({
            index: e.target.selectedIndex
        });
    });
    this._elements.addButton.addEventListener('click', function () {
        _this.addButtonClicked.notify();
    });
    this._elements.delButton.addEventListener('click', function () {
        _this.delButtonClicked.notify();
    });
}

ListView.prototype = {
    show: function () {
    "use strict";
        this.rebuildList();
    },

    rebuildList: function () {
    "use strict";
        var list, items, key;

        list = this._elements.list;
        // list.html('');
        __remove_childs('list');

        console.log('list', list);
        items = this._model.getItems();
        console.log('items', items);
        for (key in items) {
            if (items.hasOwnProperty(key)) {
              var option = document.createElement('option');
              option.innerHTML = items[key];
                list.appendChild(option);
            }
        }
        this._model.setSelectedIndex(-1);
    }
};

/**
 * The Controller. Controller responds to user actions and
 * invokes changes on the model.
 */
function ListController(model, view) {
  "use strict";
    this._model = model;
    this._view = view;

    var _this = this;

    this._view.listModified.attach(function (sender, args) {
        _this.updateSelected(args.index);
    });

    this._view.addButtonClicked.attach(function () {
        _this.addItem();
    });

    this._view.delButtonClicked.attach(function () {
        _this.delItem();
    });
}

ListController.prototype = {
    addItem: function () {
  "use strict";
        var item = window.prompt('Add item:', '');
        if (item) {
            this._model.addItem(item);
        }
    },

    delItem: function () {
  "use strict";
        var index;

        index = this._model.getSelectedIndex();
        if (index !== -1) {
            this._model.removeItemAt(this._model.getSelectedIndex());
        }
    },

    updateSelected: function (index) {
  "use strict";
        this._model.setSelectedIndex(index);
    }
};

var mvc = function() {
  "use strict";
    var model = new ListModel(['PHP', 'JavaScript']),
        view = new ListView(model, {
            list: document.getElementById('list'),
            addButton: document.getElementById('plusBtn'),
            delButton: document.getElementById('minusBtn')
        }),
        controller = new ListController(model, view);

    view.show();
    console.log("controller", controller);
}();

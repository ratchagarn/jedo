(function() {

'use strict';

var Counter = Jedo.createUI({

  model: function() {

    return {
      count: 0
    };

  },


  sync: function() {
    var $button = this.$node.find('button'),
        $count = this.$node.find('span');

    $button.on('click', function() {
      this.update({ count: ++this.$model.count });
    }.bind(this));
  },


  template: function() {

    return (

      '<div class="counter-ui">' +
        '<button>Count</button>' +
        '<span class="count"><%= count %></span>' +
      '</div>'

    );

  }

});


// render UI

Counter.render('#c1');


}).call(this);
(function() {

'use strict';

var Counter = Jedo.createUI({

  model: function() {

    return {
      count: 0
    };

  },


  sync: function() {

    var $node = $(this.$node),
        $button = $node.find('button'),
        $count = $node.find('span');

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

var target = document.querySelectorAll('.counter');

for (var i = 0, len = target.length; i < len; i++) {
  Counter.render( target[i] );
}


}).call(this);
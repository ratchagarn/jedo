(function() {

'use strict';

var Counter = Jedo.createUI({

  model: function() {

    return {
      count: 0
    };

  },


  afterRender: function() {

    $(this.node).on('click', 'button', function() {
      this.update({ count: ++this.$model.count });
    }.bind(this));

  },


  // sync: function() {

  //   var $node = $(this.$node),
  //       $button = $node.find('button'),
  //       $count = $node.find('span');

  //   $button.on('click', function() {
  //     this.update({ count: ++this.$model.count });
  //   }.bind(this));
  // },


  template: function() {

    return (

      '<div class="counter-ui">' +
        '<button class="btn btn-default">Count</button>' +
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
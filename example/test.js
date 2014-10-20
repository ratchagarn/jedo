(function() {

'use strict';

var Counter = Jedo.createUI({

  model: function() {

    return {
      count: 0
    };

  },


  template: function() {

    return (

      '<div class="counter-ui">' +
        '<span class="count"><%= count %></span>' +
      '</div>'

    );

  }

});


// render UI

var _Counter = Counter.render( document.getElementById('c1') );


var count = 0;
$('#action').on('click', function() {
  _Counter.update({ count: ++count });
});


}).call(this);
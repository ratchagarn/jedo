Jedo
====

# Simple Javascript template component
- require `jQuery` version 2.x.x

### Current Version: 0.1.1


## Change log

### 0.1.1
- Fixed bug method `afterUpdate` not working.


### 0.1.0
- Using microtemplate.
- Add new method `compile`.
- Add new method `toHTML`.


### 0.0.2
- Add callback for `update` method.


### 0.0.1
- Init project.


## Example

```javascript
<script src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
<script src="jedo.js"></script>
<script>
'use strict';

var Test = Jedo.createUI({

  afterRender: function() {
    this.$node.on('submit', function(e) {
      e.preventDefault();
      this.update({
        start_text: this.$node.find('input').val()
      });

    }.bind(this));
  },

  afterUpdate: function() {
    this.$node.find('input').focus();
  },

  template: function() {

    return (
      '<div class="example-ui">' +
        '<form>' +
          '<input type="text" />' +
          '<button type="submit">Submit</button>' +
        '</form>' +
        '<p class="output"><%= start_text %></p>' +
      '</div>'
    );

  }

});

Test.render(document.body, { start_text: 'Hello world' });
</script>
```

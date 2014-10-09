(function() {

'use strict';

var _data = {
  users: []
};


var Users = Jedo.createUI({

  bindRemoveRow: function() {
    var that = this;
    this.$node.find('tr').on('click', function() {
      var $tr = $(this);
      if (confirm('Do you want to delete ?')) {
        _data.users.splice($tr.data('index'), 1);
        that.update(_data);
      }
    });
  },


  init: function() {
    _data.users = [
      { name: 'Alex',     salaly: 30000 },
      { name: 'Ben',      salaly: 40000 },
      { name: 'Catalina', salaly: 35000 }
    ]
  },


  afterRender: function() {
    this.bindRemoveRow();
  },


  afterUpdate: function() {
    this.bindRemoveRow();
  },


  template: function() {

    var tpl = [];

    $.map(this.$data.users, function(user, i) {

      var tmp = '<tr data-index="<%= i %>">' +
                  '<td class="no"><%= (i + 1) %></td>' +
                  '<td class="name"><%= user.name %></td>' +
                  '<td class="salaly"><%= user.salaly %></td>' +
                '</tr>';

      tpl.push( this.compile( tmp, { user: user, i: i } ) );

    }.bind(this));

    return tpl.join('');
  }

});



var AddUser = Jedo.createUI({

  afterRender: function() {
    var $node = this.$node;
    $node.on('submit', function(e) {
      e.preventDefault();

      var new_user_data = {},
          error = false;

      $node.find('[name]').each(function(i, item) {
        var $el = $(item),
            key = $el.attr('name'),
            value = $el.val();

        if (!error && value === '') {
          Alert.update({ text: 'Please complete form. ' + new Date().getTime()  });
          error = true;
          return;
        }

        $el.val('');
        new_user_data[key] = value;
      });

      if (error) { return; }

      _data.users.push(new_user_data);
      Users.update(_data);
      $node.find('[name]').eq(0).focus();

    });
  },


  template: function() {

    return (
      '<form id="add-user">' +
        Alert.attach() +
        '<p>' +
          '<label>Name</label>' +
          '<input type="text" name="name" class="form-control" />' +
        '</p>' +
        '<p>' +
          '<label>Salaly</label>' +
          '<input type="text" name="salaly" class="form-control" />' +
        '</p>' +
        '<p><button type="submit" class="btn btn-primary" id="add-user">Submit</button></p>' +
      '</form>'
    );

  }

});


var Alert = Jedo.createUI({

  setData: function() {

    return {
      text: '',
      classes: ' hide'
    };

  },

  template: function() {

    if (this.$data.text !== '') {
      this.$data.classes = '';
    }

    return (
      '<div id="alert" class="alert alert-danger<%= classes %>"><%= text %></div>'
    );

  }

});


Users.render('#table-users tbody', _data);
AddUser.render('#ui-add-user', _data);


}).call(this);
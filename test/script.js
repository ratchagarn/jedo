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

    return (
      '<% Jedo.map(users, function(user, i) { %>' +
        '<tr data-index="<%= i %>">' +
          '<td class="no"><%= (i + 1) %></td>' +
          '<td class="name"><%= user.name %></td>' +
          '<td class="salaly"><%= user.salaly %></td>' +
        '</tr>' +
      '<% }); %>'
    );

  }

});



var AddUser = Jedo.createUI({

  afterRender: function() {
    var $node = this.$node;
    $node.on('submit', function(e) {
      e.preventDefault();

      var new_user_data = {};

      $node.find('[name]').each(function(i, item) {
        var $el = $(item),
            key = $el.attr('name'),
            value = $el.val();
        $el.val('');
        new_user_data[key] = value;
      });

      _data.users.push(new_user_data);
      Users.update(_data);
      $node.find('[name]').eq(0).focus();

    });
  },

  template: function() {

    return (
      '<form id="add-user">' +
        '<div id="alert" class="alert alert-danger hide"></div>' +
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


Users.render('#table-users tbody', _data);
AddUser.render('#ui-add-user', _data);


}).call(this);
/**
 * ------------------------------------------------------------
 * JEDO
 * ------------------------------------------------------------
 */


(function($) {

'use strict';

/**
 * ------------------------------------------------------------
 * Global
 * ------------------------------------------------------------
 */

var globals = this,
    ID = 0,
    tmpl = globals.microtemplate;


/**
 * Empty procsss function for use as default of callback function
 * ------------------------------------------------------------
 * @name noop
 */

function noop() {}


/**
 * Generate UI ID
 * ------------------------------------------------------------
 * @name getID
 * @return {Number} ui ID number
 */

function getID() {
  return ++ID;
}


/**
 * Render template
 * ------------------------------------------------------------
 * @name _render
 * @param {Function} template output function
 * @param {Object} template mount node
 * @param {Function} callback after template is mount
 */

function _render(scope, callback) {
  // compile template
  var tpl = tmpl(scope.template.call(scope), scope.$data),
            result = {};

  // if found node then render HTML to it
  if (scope.$node.length) {
    scope.$node.html(tpl).attr('data-jedo-id', getID());
  }
  else {
    var id = getID();
    // prepare variable for method `toHTML`
    result = {
      tpl: '<span data-jedo-id=' + id + '>' + tpl + '</span>',
      $node: '[data-jedo-id=' + id + ']'
    };
  }

  // hack process queue
  setTimeout(function() {
    (callback || noop).call(scope);
  });

  return result;
}


var Jedo = {

  /**
   * ------------------------------------------------------------
   * Base function for create UI
   * ------------------------------------------------------------
   */
  
  createUI: function(settings) {

    // scope variable for sharing context
    var scope = {};


    /**
     * ------------------------------------------------------------
     * Return public method
     * ------------------------------------------------------------
     */

    return {


      /**
       * Render UI
       * ------------------------------------------------------------
       * @name render
       * @param {String} jQuery selector for mountnode
       * @param {Object} UI data
       * @param {Function} Callback after render
       */
      
      render: function(selector, data, callback) {

        // assign this scope
        scope = $.extend({}, this, settings);
        scope.$data = data;
        scope.$node = $(selector);


        // fire init method
        (settings.init || noop).call(scope);


        // render template
        var result = _render(scope, function() {

          (callback || noop).call(scope);
          (settings.afterRender || noop).call(scope);

          if (result.$node) {
            // set node element for method `toHTML`for use method `update` later
            scope.$node = $(result.$node);
          }

        });

        return result;
      },


      /**
       * Render template to HTML
       * ------------------------------------------------------------
       * @name toHTML
       * @param {Object} UI data for template
       * @return {String} HTML of template
       */
      
      toHTML: function(data, callback) {
        if (data == null) { data = {}; }
        return this.render(undefined, data, callback).tpl;
      },


      /**
       * Alias of Microtemplates
       * ------------------------------------------------------------
       * @name compile
       * @param {String} template string
       * @param {Object} data for template
       * @return {String} string of template
       */

      compile: function(str, data) {
        if (data == null) { data = {}; }
        return tmpl(str, data);
      },


      /**
       * Update component
       * ------------------------------------------------------------
       * @name name
       * @param {Object} UI data for update
       * @param {Function} Callback after render
       */
      
      update: function(data, callback) {
        if (data == null) { data = {}; }

        // extend data to scope
        scope.$data = $.extend({}, scope.$data, data);

        // render update template
        _render(scope, function() {
          (callback || noop).call(scope);
          (settings.afterUpdate || noop).call(scope);
        });
      }

    };

  }

};


// assign `Jedo` to globals scope
globals.Jedo = Jedo;

}).call(this, jQuery);
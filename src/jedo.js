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
    tmpl = globals.microtemplate;


/**
 * Empty procsss function for use as default of callback function
 * ------------------------------------------------------------
 * @name noop
 */

function noop() {}


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
  var tpl = tmpl(scope.template.call(scope), scope.$data);
  scope.$node.html(tpl);

  // hack process queue
  setTimeout(function() {
    (callback || noop).call(scope);
  });
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

    // set default method `setData`
    if (settings.setData == null) {
      settings.setData = function() {
        return {};
      };
    }


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

        // fire init method
        (settings.init || noop).call(scope);

        // assign this scope
        scope = $.extend({}, this, settings);
        scope.$data = $.extend({}, scope.setData(), data);
        scope.$node = $(selector);

        // render template
        _render(scope, function() {
          (callback || noop).call(scope);
          (scope.afterRender || noop).call(scope);
        });

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
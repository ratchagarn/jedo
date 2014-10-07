/**
 * ------------------------------------------------------------
 * JEDO
 * ------------------------------------------------------------
 */


(function(tmpl, $) {

'use strict';

/**
 * ------------------------------------------------------------
 * Global
 * ------------------------------------------------------------
 */

var ID = 0;



/**
 * Empty procsss function for use as default callback
 * ------------------------------------------------------------
 * @name noop
 */

function noop() {}


/**
 * Generate UI ID
 * ------------------------------------------------------------
 * @name getID
 * @return {String} ui string ID
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
  var tpl = tmpl(scope.template.call(scope), scope.$data),
            result = {};

  if (scope.$node.length) {
    scope.$node.html(tpl).attr('data-jedo-id', getID());
  }
  else {
    var id = getID();
    result = {
      tpl: '<span data-jedo-id=' + id + '>' + tpl + '</span>',
      $node: '[data-jedo-id=' + id + ']'
    };
  }

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

        (settings.init || noop).call(scope);

        var result = _render(scope, function() {
          (callback || noop).call(scope);
          (settings.afterRender || noop).call(scope);
          if (result.$node) {
            scope.$node = $(result.$node);
          }
        });

        if (result.tpl) { return result.tpl; }
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
        return this.render(undefined, data, callback);
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
        scope.$data = $.extend({}, scope.$data, data);
        _render(scope, function() {
          (callback || noop).call(scope);
          (settings.afterRenderUpdate || noop).call(scope);
        });
      }

    };

  }

};


window.Jedo = Jedo;


}).call(this, microtemplate, jQuery);
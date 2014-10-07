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
    attach_key = 'data-jedo-attach',
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
    var attach_id = scope.$node.attr(attach_key);
    if (attach_id) {
      scope.$node.replaceWith( $(tpl).attr(attach_key, attach_id) );
      var addition_callback = function() {
        scope.$node = $('[' + attach_key + '=' + attach_id + ']');
      };
    }
    else {
      scope.$node.html(tpl);
    }
  }

  // hack process queue
  setTimeout(function() {
    (callback || noop).call(scope);
    (addition_callback || noop)();
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
       * Attach template to another template
       * ------------------------------------------------------------
       * @name toHTML
       * @param {Object} UI data for template
       * @return {String} HTML of template
       */
      
      attach: function(data, callback) {
        if (data == null) { data = {}; }
        scope = $.extend({}, this, settings);
        scope.$data = $.extend({}, scope.setData(), data);

        var id = getID(),
            $tpl = $( this.compile(settings.template.call(scope), scope.$data) )
                  .attr(attach_key, id);

        setTimeout(function() {
          scope.$node = $('[' + attach_key + '="' + id + '"]');
        });

        return $tpl[0].outerHTML;
        // return this.render(undefined, data, callback).tpl;
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
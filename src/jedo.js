/**
 * ------------------------------------------------------------
 * JEDO
 * ------------------------------------------------------------
 */


(function() {

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
 * Deep extend object.
 * ============================================================
 * @name extend
 * @param {Object} destination object.
 * @param {Object} object for extend to destination.
 * @return {Object} reference to destination.
 * See: http://andrewdupont.net/2009/08/28/deep-extending-objects-in-javascript/
 */

function extend(dst, source) {
  for (var prop in source) {
    if (source[prop] && source[prop].constructor && source[prop].constructor === Object) {
      dst[prop] = dst[prop] || {};
      extend(dst[prop], source[prop]);
    } else {
      dst[prop] = source[prop];
    }
  }
  return dst;
}


/**
 * Clone object.
 * ------------------------------------------------------------
 * @name clone
 * @param {Object} object is want to clone.
 * @return {Object} object it is not inherit of another.
 */

function clone(from) {
  var name, to;
  to = {};
  for (name in from) {
    if (from.hasOwnProperty(name)) {
      to[name] = from[name];
    }
  }
  return to;
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
  var tpl = tmpl(scope.template.call(scope), scope.$model);
  scope.node.innerHTML = tpl;

  // hack process queue
  setTimeout(function() {
    (scope.sync || noop).call(scope);
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

    // define default setting
    var default_setting = {

      model: function() {
        return {};
      },

      sync: noop

    };


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
       * @param {Object} DOM node object
       * @param {Object} UI data
       * @param {Function} Callback after render
       */
      
      render: function(node, data, callback) {

        // check node exist
        if (!node) {
          throw new Error('Not found element target for mount UI');
        }

        // clone setting and scope for multiple use for another selector
        var _settings = extend( default_setting, clone(settings) ),
            scope = clone( extend(this, _settings ) );

        // assign this to scope
        scope.$model = extend( scope.model(), data );
        scope.node = node;

        // fire init method
        (_settings.init || noop).call(scope);


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
        var scope = this;

        if (data == null) { data = {}; }

        // extend data to scope
        scope.$model = extend( scope.$model, data );

        // render update template
        _render(scope, function() {
          (callback || noop).call(scope);
          (scope.afterUpdate || noop).call(scope);
        });
      }

    };

  }

};


// assign `Jedo` to globals scope
globals.Jedo = Jedo;

}).call(this);
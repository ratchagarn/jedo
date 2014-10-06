/**
 * ------------------------------------------------------------
 * JEDO
 * ------------------------------------------------------------
 */

(function(tmpl, $) {

'use strict';


/**
 * Empty procsss function for use as default callback
 * ------------------------------------------------------------
 * @name noop
 */

function noop() {}


var Jedo = {

  /**
   * ------------------------------------------------------------
   * Base function for create UI
   * ------------------------------------------------------------
   */
  
  createUI: function(setting) {

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

        scope = $.extend({}, this, setting);
        scope.$data = data;

        if (typeof setting.init === 'function') {
          setting.init.call(scope);
          setting.init = noop();
        }

        var tpl = tmpl(setting.template.call(scope), data),
            $mountNode = $(selector);
        $mountNode.html( tpl );

        setTimeout(function() {

          scope.$node = $mountNode;

          (callback || noop)();

          if (typeof setting.afterRender === 'function') {
            setting.afterRender.call(scope);
            setting.afterRender = noop();
          }
          else {
            (setting.afterUpdate || noop).call(scope);
          }

        });

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
        scope.render(scope.$node, scope.$data, callback);
      }

    };

  }

};


window.Jedo = Jedo;
window.Jedo.map = jQuery.map;


}).call(this, tmpl, jQuery);
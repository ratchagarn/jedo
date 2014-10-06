/*!
 * Jedo version 0.0.1
 * Copyright 2014-Preset Ratchagarn
 * Licensed under MIT
 */
/*!
  Underscore.js templates as a standalone implementation. 
  JavaScript micro-templating, similar to John Resig's implementation. 
  Underscore templates documentation: http://documentcloud.github.com/underscore/#template
  Modifyed by marlun78
*/

(function() {
 
'use strict';

// By default, Underscore uses ERB-style template delimiters, change the
// following template settings to use alternative delimiters.
var settings = {
      evaluate: /<%([\s\S]+?)%>/g,
      interpolate: /<%=([\s\S]+?)%>/g,
      escape: /<%-([\s\S]+?)%>/g
    };

// When customizing `templateSettings`, if you don't want to define an
// interpolation, evaluation or escaping regex, we need one that is
// guaranteed not to match.
var noMatch = /.^/;

// Certain characters need to be escaped so that they can be put into a
// string literal.
var escapes = {
    '\\': '\\',
    "'": "'",
    'r': '\r',
    'n': '\n',
    't': '\t',
    'u2028': '\u2028',
    'u2029': '\u2029'
  };


for (var p in escapes) {
    escapes[escapes[p]] = p;
}

var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

var tmpl = function (text, data, objectName) {

  settings.variable = objectName;

  // Compile the template source, taking care to escape characters that
  // cannot be included in a string literal and then unescape them in code
  // blocks.
  var source = "__p+='" + text
      .replace(escaper, function (match) {
          return '\\' + escapes[match];
      })
      .replace(settings.escape || noMatch, function (match, code) {
          return "'+\n_.escape(" + unescape(code) + ")+\n'";
      })
      .replace(settings.interpolate || noMatch, function (match, code) {
          return "'+\n(" + unescape(code) + ")+\n'";
      })
      .replace(settings.evaluate || noMatch, function (match, code) {
          return "';\n" + unescape(code) + "\n;__p+='";
      }) + "';\n";

  // If a variable is not specified, place data values in local scope.
  if (!settings.variable) {
      source = 'with(obj||{}){\n' + source + '}\n';
  }

  source = "var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};\n" + source + "return __p;\n";

  var render = new Function(settings.variable || 'obj', source);

  if (data) {
      return render(data);
  }

  var template = function (data) {
      return render.call(this, data);
  };

  // Provide the compiled function source as a convenience for build time
  // precompilation.
  template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

  return template;
};

window.tmpl = tmpl;

}).call(this);
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
       */
      
      render: function(selector, data) {

        scope = $.extend({}, this, setting);
        scope.data = data;

        if (typeof setting.init === 'function') {
          setting.init.call(scope);
          setting.init = noop();
        }

        var tpl = tmpl(setting.template(), data),
            $mountNode = $(selector);
        $mountNode.html( tpl );

        setTimeout(function() {

          scope.$node = $mountNode;

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
       */
      
      update: function(data) {
        scope.data = $.extend({}, scope.data, data);
        scope.render(scope.$node, scope.data);
      }

    };

  }

};


window.Jedo = Jedo;
window.Jedo.map = jQuery.map;


}).call(this, tmpl, jQuery);
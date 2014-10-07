/*!
 * Jedo version 0.1.3
 * Copyright 2014-Preset
 * Author: Ratchagarn
 * Licensed under MIT
 */
// Simple JavaScript Templating
// Paul Miller (http://paulmillr.com)
// http://underscorejs.org
// (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
(function(globals) {
  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  var settings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // List of HTML entities for escaping.
  var htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;'
  };

  var entityRe = new RegExp('[&<>"\']', 'g');

  var escapeExpr = function(string) {
    if (string == null) return '';
    return ('' + string).replace(entityRe, function(match) {
      return htmlEntities[match];
    });
  };

  var counter = 0;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  var tmpl = function(text, data) {
    var render;

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':escapeExpr(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n//# sourceURL=/microtemplates/source[" + counter++ + "]";

    try {
      render = new Function(settings.variable || 'obj', 'escapeExpr', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, escapeExpr);
    var template = function(data) {
      return render.call(this, data, escapeExpr);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };
  tmpl.settings = settings;

  if (typeof define !== 'undefined' && define.amd) {
    define([], function () {
      return tmpl;
    }); // RequireJS
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = tmpl; // CommonJS
  } else {
    globals.microtemplate = tmpl; // <script>
  }
})(this);

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
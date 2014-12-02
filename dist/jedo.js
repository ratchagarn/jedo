/*!
 * Jedo version 0.2.3
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
 * Create dom from HTML string
 * ------------------------------------------------------------
 * @name domFromSrt
 * @param {String} HTML string
 * @return {Object} dom object
 */

function domFromStr(html) {
  var frag = document.createDocumentFragment(),
      temp = document.createElement('DIV');

  temp.insertAdjacentHTML('beforeend', html);
  while (temp.firstChild) {
    frag.appendChild(temp.firstChild);
  }

  temp = null;
  return frag;
}



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
  var tpl = tmpl(scope.template.call(scope), scope.$model),
      compile_tpl = domFromStr(tpl);

  // scope.node.innerHTML = tpl;
  if (scope.node.children.length > 0) {
    scope.node.replaceChild( compile_tpl, scope.node.children[0] );
  }
  else {
    scope.node.appendChild( compile_tpl );
  }

  // fire callback
  (scope.sync || noop).call(scope);
  (callback || noop).call(scope);

  // hack process queue
  // setTimeout(function() {
  //   (scope.sync || noop).call(scope);
  //   (callback || noop).call(scope);
  // });
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

        return scope;

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
if (window !== undefined && globals !== window) {
  window.Jedo = Jedo;
}
else {
  globals.Jedo = Jedo;
}

}).call(this);
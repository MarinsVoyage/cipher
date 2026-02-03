(function ()
{
  "use strict";

  var _coreDom = {
    byId: function (_elementId)
    {
      return document.getElementById(_elementId);
    },
    createElement: function (_tagName, _className, _textContent)
    {
      var _element = document.createElement(_tagName);
      if (_className)
      {
        _element.className = _className;
      }
      if (_textContent !== undefined && _textContent !== null)
      {
        _element.textContent = _textContent;
      }
      return _element;
    },
    clearChildren: function (_element)
    {
      while (_element.firstChild)
      {
        _element.removeChild(_element.firstChild);
      }
    }
  };

  window.CipherCoreDom = _coreDom;
}());

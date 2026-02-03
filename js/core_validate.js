(function ()
{
  "use strict";

  function _countCharacters(_inputText)
  {
    var _normalizedText = _inputText || "";
    var _characterCount = 0;
    var _stringIndex = 0;

    while (_stringIndex < _normalizedText.length)
    {
      var _codePointValue = _normalizedText.codePointAt(_stringIndex);
      _stringIndex += _codePointValue > 65535 ? 2 : 1;
      _characterCount += 1;
    }

    return _characterCount;
  }

  var _coreValidate = {
    countCharacters: _countCharacters,
    enforceMaxInput: function (_inputText, _maximumCharacters)
    {
      var _normalizedText = _inputText || "";
      var _maximumCharacterCount = typeof _maximumCharacters === "number" ? _maximumCharacters : 0;
      if (_maximumCharacterCount <= 0)
      {
        return {
          value: _normalizedText,
          wasTrimmed: false,
          remaining: 0
        };
      }

      // Count Unicode code points so trimming does not split surrogate pairs, for example "🙂" counts as one character.
      var _characterCount = 0;
      var _stringIndex = 0;
      var _lastSafeIndex = 0;

      while (_stringIndex < _normalizedText.length && _characterCount < _maximumCharacterCount)
      {
        var _codePointValue = _normalizedText.codePointAt(_stringIndex);
        _stringIndex += _codePointValue > 65535 ? 2 : 1;
        _characterCount += 1;
        _lastSafeIndex = _stringIndex;
      }

      if (_stringIndex >= _normalizedText.length)
      {
        return {
          value: _normalizedText,
          wasTrimmed: false,
          remaining: _maximumCharacterCount - _characterCount
        };
      }

      return {
        value: _normalizedText.slice(0, _lastSafeIndex),
        wasTrimmed: true,
        remaining: 0
      };
    }
  };

  window.CipherCoreValidate = _coreValidate;
}());

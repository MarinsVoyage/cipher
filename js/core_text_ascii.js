(function ()
{
  "use strict";

  function _encodeAscii(_inputText, _errorMode)
  {
    var _byteValues = [];
    var _characterIndex = 0;

    while (_characterIndex < _inputText.length)
    {
      var _codePointValue = _inputText.codePointAt(_characterIndex);
      var _codePointLength = _codePointValue > 65535 ? 2 : 1;
      if (_codePointValue <= 127)
      {
        _byteValues.push(_codePointValue);
      }
      else if (_errorMode === "ignore")
      {
        _characterIndex += _codePointLength;
        continue;
      }
      else if (_errorMode === "replace")
      {
        _byteValues.push(63);
      }
      else
      {
        return {
          error: "ASCII encoding does not support characters above U+007F.",
          bytes: []
        };
      }
      _characterIndex += _codePointLength;
    }

    return {
      bytes: _byteValues,
      error: null
    };
  }

  function _decodeAscii(_byteValues, _errorMode)
  {
    var _decodedText = "";
    var _byteIndex = 0;

    for (_byteIndex = 0; _byteIndex < _byteValues.length; _byteIndex += 1)
    {
      var _byteValue = _byteValues[_byteIndex];
      if (_byteValue <= 127)
      {
        _decodedText += String.fromCodePoint(_byteValue);
      }
      else if (_errorMode === "ignore")
      {
        continue;
      }
      else if (_errorMode === "replace")
      {
        _decodedText += "?";
      }
      else
      {
        return {
          error: "ASCII decoding encountered a byte above 0x7F.",
          text: ""
        };
      }
    }

    return {
      text: _decodedText,
      error: null
    };
  }

  window.CipherCoreTextAscii = {
    encode: _encodeAscii,
    decode: _decodeAscii
  };
}());

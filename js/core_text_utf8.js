(function ()
{
  "use strict";

  function _encodeUtf8(_inputText)
  {
    var _textEncoder = new TextEncoder();
    var _byteValues = Array.prototype.slice.call(_textEncoder.encode(_inputText));
    return {
      bytes: _byteValues,
      error: null
    };
  }

  function _decodeUtf8(_byteValues, _errorMode)
  {
    // Decode UTF-8 manually so error modes can skip bad bytes; for example, with errorMode="ignore" the byte 0xFF is dropped instead of producing U+FFFD.
    var _decodedText = "";
    var _byteIndex = 0;
    var _normalizedErrorMode = _errorMode || "strict";

    while (_byteIndex < _byteValues.length)
    {
      var _firstByte = _byteValues[_byteIndex];
      if (_firstByte <= 127)
      {
        _decodedText += String.fromCodePoint(_firstByte);
        _byteIndex += 1;
        continue;
      }

      var _continuationByteCount = 0;
      var _codePointValue = null;
      var _secondByte = 0;
      var _thirdByte = 0;
      var _fourthByte = 0;

      if (_firstByte >= 194 && _firstByte <= 223)
      {
        _continuationByteCount = 1;
      }
      else if (_firstByte >= 224 && _firstByte <= 239)
      {
        _continuationByteCount = 2;
      }
      else if (_firstByte >= 240 && _firstByte <= 244)
      {
        _continuationByteCount = 3;
      }
      else
      {
        if (_normalizedErrorMode === "strict")
        {
          return {
            error: "UTF-8 decoding encountered an incorrect leading byte.",
            text: ""
          };
        }
        if (_normalizedErrorMode === "replace")
        {
          _decodedText += "\uFFFD";
        }
        _byteIndex += 1;
        continue;
      }

      if (_byteIndex + _continuationByteCount >= _byteValues.length)
      {
        if (_normalizedErrorMode === "strict")
        {
          return {
            error: "UTF-8 decoding encountered a truncated sequence.",
            text: ""
          };
        }
        if (_normalizedErrorMode === "replace")
        {
          _decodedText += "\uFFFD";
        }
        _byteIndex += 1;
        continue;
      }

      _secondByte = _byteValues[_byteIndex + 1];
      if (_secondByte < 128 || _secondByte > 191)
      {
        if (_normalizedErrorMode === "strict")
        {
          return {
            error: "UTF-8 decoding encountered an incorrect continuation byte.",
            text: ""
          };
        }
        if (_normalizedErrorMode === "replace")
        {
          _decodedText += "\uFFFD";
        }
        _byteIndex += 1;
        continue;
      }

      if (_continuationByteCount >= 2)
      {
        _thirdByte = _byteValues[_byteIndex + 2];
        if (_thirdByte < 128 || _thirdByte > 191)
        {
          if (_normalizedErrorMode === "strict")
          {
            return {
              error: "UTF-8 decoding encountered an incorrect continuation byte.",
              text: ""
            };
          }
          if (_normalizedErrorMode === "replace")
          {
            _decodedText += "\uFFFD";
          }
          _byteIndex += 1;
          continue;
        }
      }

      if (_continuationByteCount === 3)
      {
        _fourthByte = _byteValues[_byteIndex + 3];
        if (_fourthByte < 128 || _fourthByte > 191)
        {
          if (_normalizedErrorMode === "strict")
          {
            return {
              error: "UTF-8 decoding encountered an incorrect continuation byte.",
              text: ""
            };
          }
          if (_normalizedErrorMode === "replace")
          {
            _decodedText += "\uFFFD";
          }
          _byteIndex += 1;
          continue;
        }
      }

      if (_continuationByteCount === 1)
      {
        _codePointValue = ((_firstByte & 31) << 6) | (_secondByte & 63);
      }
      else if (_continuationByteCount === 2)
      {
        if (_firstByte === 224 && _secondByte < 160)
        {
          _codePointValue = null;
        }
        else if (_firstByte === 237 && _secondByte > 159)
        {
          _codePointValue = null;
        }
        else
        {
          _codePointValue = ((_firstByte & 15) << 12) | ((_secondByte & 63) << 6) | (_thirdByte & 63);
        }
      }
      else
      {
        if (_firstByte === 240 && _secondByte < 144)
        {
          _codePointValue = null;
        }
        else if (_firstByte === 244 && _secondByte > 143)
        {
          _codePointValue = null;
        }
        else
        {
          _codePointValue = ((_firstByte & 7) << 18) | ((_secondByte & 63) << 12) | ((_thirdByte & 63) << 6) | (_fourthByte & 63);
        }
      }

      if (_codePointValue === null || _codePointValue > 1114111)
      {
        if (_normalizedErrorMode === "strict")
        {
          return {
            error: "UTF-8 decoding encountered an incorrect sequence.",
            text: ""
          };
        }
        if (_normalizedErrorMode === "replace")
        {
          _decodedText += "\uFFFD";
        }
        _byteIndex += 1;
        continue;
      }

      _decodedText += String.fromCodePoint(_codePointValue);
      _byteIndex += _continuationByteCount + 1;
    }

    return {
      text: _decodedText,
      error: null
    };
  }

  window.CipherCoreTextUtf8 = {
    encode: _encodeUtf8,
    decode: _decodeUtf8
  };
}());

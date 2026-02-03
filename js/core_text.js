(function ()
{
  "use strict";

  var _encodingCache = {};

  function _getEncodingDefinition(_encodingsConfig, _encodingId)
  {
    var _supportedEncodingList = _encodingsConfig && _encodingsConfig.supportedEncodings ? _encodingsConfig.supportedEncodings : [];
    var _encodingIndex = 0;
    for (_encodingIndex = 0; _encodingIndex < _supportedEncodingList.length; _encodingIndex += 1)
    {
      if (_supportedEncodingList[_encodingIndex].id === _encodingId)
      {
        return _supportedEncodingList[_encodingIndex];
      }
    }
    return null;
  }

  function _getCp037Maps(_encodingsConfig)
  {
    if (_encodingCache.cp037)
    {
      return _encodingCache.cp037;
    }

    var _encodingDefinition = _getEncodingDefinition(_encodingsConfig, "ebcdic-cp037");
    if (!_encodingDefinition || !_encodingDefinition.mapping || !_encodingDefinition.mapping.byteToUnicodeCodePoint)
    {
      return null;
    }

    var _byteToUnicodeCodePoints = _encodingDefinition.mapping.byteToUnicodeCodePoint.slice(0);
    var _unicodeCodePointToByte = {};
    var _byteValue = 0;
    for (_byteValue = 0; _byteValue < _byteToUnicodeCodePoints.length; _byteValue += 1)
    {
      if (_unicodeCodePointToByte[_byteToUnicodeCodePoints[_byteValue]] === undefined)
      {
        _unicodeCodePointToByte[_byteToUnicodeCodePoints[_byteValue]] = _byteValue;
      }
    }

    var _replacementByteValue = _unicodeCodePointToByte[63];
    if (typeof _replacementByteValue !== "number")
    {
      _replacementByteValue = null;
    }

    _encodingCache.cp037 = {
      byteToUnicodeCodePoint: _byteToUnicodeCodePoints,
      unicodeCodePointToByte: _unicodeCodePointToByte,
      replacementByte: _replacementByteValue
    };

    return _encodingCache.cp037;
  }

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

  function _encodeCp037(_inputText, _errorMode, _encodingsConfig)
  {
    var _cp037Maps = _getCp037Maps(_encodingsConfig);
    if (!_cp037Maps)
    {
      return {
        error: "CP037 mapping is missing.",
        bytes: []
      };
    }

    var _byteValues = [];
    var _characterIndex = 0;

    while (_characterIndex < _inputText.length)
    {
      var _codePointValue = _inputText.codePointAt(_characterIndex);
      var _codePointLength = _codePointValue > 65535 ? 2 : 1;
      var _mappedByteValue = _cp037Maps.unicodeCodePointToByte[_codePointValue];

      if (typeof _mappedByteValue === "number")
      {
        _byteValues.push(_mappedByteValue);
      }
      else if (_errorMode === "ignore")
      {
        _characterIndex += _codePointLength;
        continue;
      }
      else if (_errorMode === "replace")
      {
        if (_cp037Maps.replacementByte === null)
        {
          return {
            error: "CP037 mapping does not include a replacement character.",
            bytes: []
          };
        }
        _byteValues.push(_cp037Maps.replacementByte);
      }
      else
      {
        return {
          error: "CP037 encoding does not support one or more characters.",
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

  function _decodeCp037(_byteValues, _errorMode, _encodingsConfig)
  {
    var _cp037Maps = _getCp037Maps(_encodingsConfig);
    if (!_cp037Maps)
    {
      return {
        error: "CP037 mapping is missing.",
        text: ""
      };
    }

    var _decodedText = "";
    var _byteIndex = 0;

    for (_byteIndex = 0; _byteIndex < _byteValues.length; _byteIndex += 1)
    {
      var _codePointValue = _cp037Maps.byteToUnicodeCodePoint[_byteValues[_byteIndex]];
      if (typeof _codePointValue === "number")
      {
        _decodedText += String.fromCodePoint(_codePointValue);
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
          error: "CP037 decoding encountered an unmapped byte.",
          text: ""
        };
      }
    }

    return {
      text: _decodedText,
      error: null
    };
  }

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

  function _encodeText(_inputText, _encodingId, _errorMode, _encodingsConfig)
  {
    if (_encodingId === "utf-8")
    {
      return _encodeUtf8(_inputText);
    }
    if (_encodingId === "ascii")
    {
      return _encodeAscii(_inputText, _errorMode);
    }
    if (_encodingId === "ebcdic-cp037")
    {
      return _encodeCp037(_inputText, _errorMode, _encodingsConfig);
    }
    return {
      error: "Unsupported encoding.",
      bytes: []
    };
  }

  function _decodeBytes(_byteValues, _encodingId, _errorMode, _encodingsConfig)
  {
    if (_encodingId === "utf-8")
    {
      return _decodeUtf8(_byteValues, _errorMode);
    }
    if (_encodingId === "ascii")
    {
      return _decodeAscii(_byteValues, _errorMode);
    }
    if (_encodingId === "ebcdic-cp037")
    {
      return _decodeCp037(_byteValues, _errorMode, _encodingsConfig);
    }
    return {
      error: "Unsupported encoding.",
      text: ""
    };
  }

  window.CipherCoreText = {
    encodeText: _encodeText,
    decodeBytes: _decodeBytes,
    getEncodingDefinition: _getEncodingDefinition
  };
}());

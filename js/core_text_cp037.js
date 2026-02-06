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

  window.CipherCoreTextCp037 = {
    encode: _encodeCp037,
    decode: _decodeCp037,
    getEncodingDefinition: _getEncodingDefinition
  };
}());

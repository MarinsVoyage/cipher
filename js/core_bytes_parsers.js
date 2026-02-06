(function ()
{
  "use strict";

  var _hexadecimalDigitPattern = /^[0-9a-fA-F]$/;
  var _binaryDigitPattern = /^[01]$/;

  function _isHexadecimalSeparatorCharacter(_character)
  {
    return _character === " " || _character === ":" || _character === "\n" || _character === "\r" || _character === "\t";
  }

  function _isBinarySeparatorCharacter(_character)
  {
    return _character === " " || _character === "_" || _character === "-" || _character === "\n" || _character === "\r" || _character === "\t";
  }

  function _parseHexadecimalToBytes(_hexadecimalText, _strictHexadecimal)
  {
    var _normalizedHexadecimalDigits = "";
    var _characterIndex = 0;
    var _currentCharacter = "";
    var _isStrictHexadecimal = _strictHexadecimal === true;

    for (_characterIndex = 0; _characterIndex < _hexadecimalText.length; _characterIndex += 1)
    {
      _currentCharacter = _hexadecimalText[_characterIndex];
      if (_hexadecimalDigitPattern.test(_currentCharacter))
      {
        _normalizedHexadecimalDigits += _currentCharacter;
      }
      else if (_isHexadecimalSeparatorCharacter(_currentCharacter))
      {
        continue;
      }
      else if (_isStrictHexadecimal)
      {
        return {
          error: "Hexadecimal input contains incorrect characters.",
          bytes: []
        };
      }
    }

    if (_normalizedHexadecimalDigits.length === 0)
    {
      return {
        bytes: [],
        error: null
      };
    }

    if (_normalizedHexadecimalDigits.length % 2 !== 0)
    {
      if (_isStrictHexadecimal)
      {
        return {
          error: "Hexadecimal input has an odd number of digits.",
          bytes: []
        };
      }
      _normalizedHexadecimalDigits = "0" + _normalizedHexadecimalDigits;
    }

    var _byteValues = [];
    for (_characterIndex = 0; _characterIndex < _normalizedHexadecimalDigits.length; _characterIndex += 2)
    {
      var _byteValue = parseInt(_normalizedHexadecimalDigits.slice(_characterIndex, _characterIndex + 2), 16);
      if (Number.isNaN(_byteValue))
      {
        return {
          error: "Hexadecimal input could not be parsed.",
          bytes: []
        };
      }
      _byteValues.push(_byteValue);
    }

    return {
      bytes: _byteValues,
      error: null
    };
  }

  function _parseBinaryToBytes(_binaryText, _strictBinary)
  {
    var _normalizedBinaryDigits = "";
    var _characterIndex = 0;
    var _currentCharacter = "";
    var _isStrictBinary = _strictBinary === true;

    for (_characterIndex = 0; _characterIndex < _binaryText.length; _characterIndex += 1)
    {
      _currentCharacter = _binaryText[_characterIndex];
      if (_binaryDigitPattern.test(_currentCharacter))
      {
        _normalizedBinaryDigits += _currentCharacter;
      }
      else if (_isBinarySeparatorCharacter(_currentCharacter))
      {
        continue;
      }
      else if (_isStrictBinary)
      {
        return {
          error: "Binary input contains incorrect characters.",
          bytes: []
        };
      }
    }

    if (_normalizedBinaryDigits.length === 0)
    {
      return {
        bytes: [],
        error: null
      };
    }

    if (_normalizedBinaryDigits.length % 8 !== 0)
    {
      if (_isStrictBinary)
      {
        return {
          error: "Binary input does not align to full bytes.",
          bytes: []
        };
      }
      _normalizedBinaryDigits = _normalizedBinaryDigits.slice(0, _normalizedBinaryDigits.length - (_normalizedBinaryDigits.length % 8));
    }

    var _byteValues = [];
    for (_characterIndex = 0; _characterIndex < _normalizedBinaryDigits.length; _characterIndex += 8)
    {
      var _binarySegment = _normalizedBinaryDigits.slice(_characterIndex, _characterIndex + 8);
      var _byteValue = parseInt(_binarySegment, 2);
      if (Number.isNaN(_byteValue))
      {
        return {
          error: "Binary input could not be parsed.",
          bytes: []
        };
      }
      _byteValues.push(_byteValue);
    }

    return {
      bytes: _byteValues,
      error: null
    };
  }

  window.CipherCoreBytesParsers = {
    parseHexadecimalToBytes: _parseHexadecimalToBytes,
    parseBinaryToBytes: _parseBinaryToBytes
  };
}());

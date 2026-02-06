(function ()
{
  "use strict";

  function _bytesToHexadecimal(_byteValues, _uppercase, _separator)
  {
    var _hexadecimalSegments = [];
    var _byteIndex = 0;
    for (_byteIndex = 0; _byteIndex < _byteValues.length; _byteIndex += 1)
    {
      var _hexadecimalValue = _byteValues[_byteIndex].toString(16).padStart(2, "0");
      _hexadecimalSegments.push(_uppercase ? _hexadecimalValue.toUpperCase() : _hexadecimalValue.toLowerCase());
    }
    return _hexadecimalSegments.join(_separator);
  }

  function _bytesToBinary(_byteValues, _groupSizeInBits, _separator)
  {
    var _groupSize = typeof _groupSizeInBits === "number" ? _groupSizeInBits : 8;
    var _binaryGroups = [];
    var _byteIndex = 0;
    var _binaryString = "";
    var _startIndex = 0;

    if (_groupSize <= 0 || _groupSize > 8)
    {
      _groupSize = 8;
    }

    for (_byteIndex = 0; _byteIndex < _byteValues.length; _byteIndex += 1)
    {
      _binaryString = _byteValues[_byteIndex].toString(2).padStart(8, "0");
      if (_groupSize >= 8)
      {
        _binaryGroups.push(_binaryString);
        continue;
      }

      _startIndex = 0;
      while (_startIndex < _binaryString.length)
      {
        _binaryGroups.push(_binaryString.slice(_startIndex, _startIndex + _groupSize));
        _startIndex += _groupSize;
      }
    }

    return _binaryGroups.join(_separator);
  }

  window.CipherCoreBytesFormatters = {
    bytesToHexadecimal: _bytesToHexadecimal,
    bytesToBinary: _bytesToBinary
  };
}());

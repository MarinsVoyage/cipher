(function ()
{
  "use strict";

  function _buildResult(_outputText, _errors)
  {
    return {
      outputText: _outputText,
      errors: _errors || []
    };
  }

  function _convertTextToHexadecimal(_inputText, _parameterValues, _configuration)
  {
    var _encodingResult = window.CipherCoreText.encodeText(_inputText, _parameterValues.encodingId, _parameterValues.errors, _configuration.encodings);
    if (_encodingResult.error)
    {
      return _buildResult("", [_encodingResult.error]);
    }

    var _hexadecimalText = window.CipherCoreBytes.bytesToHexadecimal(_encodingResult.bytes, _parameterValues.uppercase === true, _parameterValues.separator);
    return _buildResult(_hexadecimalText, []);
  }

  function _convertHexadecimalToText(_inputText, _parameterValues, _configuration)
  {
    var _parseResult = window.CipherCoreBytes.parseHexadecimalToBytes(_inputText, _parameterValues.strictHexadecimal === true);
    if (_parseResult.error)
    {
      return _buildResult("", [_parseResult.error]);
    }

    var _decodeResult = window.CipherCoreText.decodeBytes(_parseResult.bytes, _parameterValues.encodingId, _parameterValues.errors, _configuration.encodings);
    if (_decodeResult.error)
    {
      return _buildResult("", [_decodeResult.error]);
    }

    return _buildResult(_decodeResult.text, []);
  }

  function _convertTextToBinary(_inputText, _parameterValues, _configuration)
  {
    var _encodingResult = window.CipherCoreText.encodeText(_inputText, _parameterValues.encodingId, _parameterValues.errors, _configuration.encodings);
    if (_encodingResult.error)
    {
      return _buildResult("", [_encodingResult.error]);
    }

    var _binaryText = window.CipherCoreBytes.bytesToBinary(_encodingResult.bytes, _parameterValues.groupSizeBits, _parameterValues.separator);
    return _buildResult(_binaryText, []);
  }

  function _convertBinaryToText(_inputText, _parameterValues, _configuration)
  {
    var _parseResult = window.CipherCoreBytes.parseBinaryToBytes(_inputText, _parameterValues.strictBinary === true);
    if (_parseResult.error)
    {
      return _buildResult("", [_parseResult.error]);
    }

    var _decodeResult = window.CipherCoreText.decodeBytes(_parseResult.bytes, _parameterValues.encodingId, _parameterValues.errors, _configuration.encodings);
    if (_decodeResult.error)
    {
      return _buildResult("", [_decodeResult.error]);
    }

    return _buildResult(_decodeResult.text, []);
  }

  var _toolHandlersByIdentifier = {
    "convert.text_to_hexadecimal": _convertTextToHexadecimal,
    "convert.hexadecimal_to_text": _convertHexadecimalToText,
    "convert.text_to_binary": _convertTextToBinary,
    "convert.binary_to_text": _convertBinaryToText
  };

  function _runTool(_toolIdentifier, _inputText, _parameterValues, _configuration)
  {
    var _handler = _toolHandlersByIdentifier[_toolIdentifier];
    if (!_handler)
    {
      return _buildResult("", ["Tool not implemented."]);
    }
    return _handler(_inputText, _parameterValues, _configuration);
  }

  window.CipherAppToolsConvert = {
    runTool: _runTool
  };
}());

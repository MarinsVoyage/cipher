(function ()
{
  "use strict";

  function _convertTextToBinary(_inputText, _parameterValues, _configuration)
  {
    var _encodingResult = window.CipherCoreText.encodeText(_inputText, _parameterValues.encodingId, _parameterValues.errors, _configuration.encodings);
    if (_encodingResult.error)
    {
      return {
        outputText: "",
        errors: [_encodingResult.error]
      };
    }

    var _binaryText = window.CipherCoreBytes.bytesToBinary(_encodingResult.bytes, _parameterValues.groupSizeBits, _parameterValues.separator);
    return {
      outputText: _binaryText,
      errors: []
    };
  }

  function _convertBinaryToText(_inputText, _parameterValues, _configuration)
  {
    var _parseResult = window.CipherCoreBytes.parseBinaryToBytes(_inputText, _parameterValues.strictBinary === true);
    if (_parseResult.error)
    {
      return {
        outputText: "",
        errors: [_parseResult.error]
      };
    }

    var _decodeResult = window.CipherCoreText.decodeBytes(_parseResult.bytes, _parameterValues.encodingId, _parameterValues.errors, _configuration.encodings);
    if (_decodeResult.error)
    {
      return {
        outputText: "",
        errors: [_decodeResult.error]
      };
    }

    return {
      outputText: _decodeResult.text,
      errors: []
    };
  }

  window.CipherAppToolsConvertBinary = {
    convertTextToBinary: _convertTextToBinary,
    convertBinaryToText: _convertBinaryToText
  };
}());

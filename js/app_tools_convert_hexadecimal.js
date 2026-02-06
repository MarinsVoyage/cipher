(function ()
{
  "use strict";

  function _convertTextToHexadecimal(_inputText, _parameterValues, _configuration)
  {
    var _encodingResult = window.CipherCoreText.encodeText(_inputText, _parameterValues.encodingId, _parameterValues.errors, _configuration.encodings);
    if (_encodingResult.error)
    {
      return {
        outputText: "",
        errors: [_encodingResult.error]
      };
    }

    var _hexadecimalText = window.CipherCoreBytes.bytesToHexadecimal(_encodingResult.bytes, _parameterValues.uppercase === true, _parameterValues.separator);
    return {
      outputText: _hexadecimalText,
      errors: []
    };
  }

  function _convertHexadecimalToText(_inputText, _parameterValues, _configuration)
  {
    var _parseResult = window.CipherCoreBytes.parseHexadecimalToBytes(_inputText, _parameterValues.strictHexadecimal === true);
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

  window.CipherAppToolsConvertHexadecimal = {
    convertTextToHexadecimal: _convertTextToHexadecimal,
    convertHexadecimalToText: _convertHexadecimalToText
  };
}());

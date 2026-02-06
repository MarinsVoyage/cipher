(function ()
{
  "use strict";

  function _getToolHandlersByIdentifier()
  {
    var _hexadecimalConverters = window.CipherAppToolsConvertHexadecimal || {};
    var _binaryConverters = window.CipherAppToolsConvertBinary || {};

    return {
      "convert.text_to_hexadecimal": _hexadecimalConverters.convertTextToHexadecimal,
      "convert.hexadecimal_to_text": _hexadecimalConverters.convertHexadecimalToText,
      "convert.text_to_binary": _binaryConverters.convertTextToBinary,
      "convert.binary_to_text": _binaryConverters.convertBinaryToText
    };
  }

  function _runTool(_toolIdentifier, _inputText, _parameterValues, _configuration)
  {
    var _toolHandlersByIdentifier = _getToolHandlersByIdentifier();
    var _handler = _toolHandlersByIdentifier[_toolIdentifier];
    if (typeof _handler !== "function")
    {
      return {
        outputText: "",
        errors: ["Tool not implemented."]
      };
    }
    return _handler(_inputText, _parameterValues, _configuration);
  }

  window.CipherAppToolsConvert = {
    runTool: _runTool
  };
}());

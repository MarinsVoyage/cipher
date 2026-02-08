(function ()
{
  "use strict";

  function _convertTextToHexadecimal(_inputText, _parameterValues, _configuration)
  {
    var _resolvedParameterValues = _parameterValues || {};
    return window.CipherAppToolsConvertShared.runEncodeToFormatted(_inputText, _resolvedParameterValues, _configuration, function (_byteValues)
    {
      return window.CipherCoreBytes.bytesToHexadecimal(_byteValues, _resolvedParameterValues.uppercase === true, _resolvedParameterValues.separator);
    });
  }

  function _convertHexadecimalToText(_inputText, _parameterValues, _configuration)
  {
    var _resolvedParameterValues = _parameterValues || {};
    return window.CipherAppToolsConvertShared.runParsedToDecoded(_inputText, _resolvedParameterValues, _configuration, function (_rawInputText)
    {
      return window.CipherCoreBytes.parseHexadecimalToBytes(_rawInputText, _resolvedParameterValues.strictHexadecimal === true);
    });
  }

  window.CipherAppToolsConvertHexadecimal = {
    convertTextToHexadecimal: _convertTextToHexadecimal,
    convertHexadecimalToText: _convertHexadecimalToText
  };
}());

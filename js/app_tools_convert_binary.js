(function ()
{
  "use strict";

  function _convertTextToBinary(_inputText, _parameterValues, _configuration)
  {
    var _resolvedParameterValues = _parameterValues || {};
    return window.CipherAppToolsConvertShared.runEncodeToFormatted(_inputText, _resolvedParameterValues, _configuration, function (_byteValues)
    {
      return window.CipherCoreBytes.bytesToBinary(_byteValues, _resolvedParameterValues.groupSizeBits, _resolvedParameterValues.separator);
    });
  }

  function _convertBinaryToText(_inputText, _parameterValues, _configuration)
  {
    var _resolvedParameterValues = _parameterValues || {};
    return window.CipherAppToolsConvertShared.runParsedToDecoded(_inputText, _resolvedParameterValues, _configuration, function (_rawInputText)
    {
      return window.CipherCoreBytes.parseBinaryToBytes(_rawInputText, _resolvedParameterValues.strictBinary === true);
    });
  }

  window.CipherAppToolsConvertBinary = {
    convertTextToBinary: _convertTextToBinary,
    convertBinaryToText: _convertBinaryToText
  };
}());

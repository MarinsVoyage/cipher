(function ()
{
  "use strict";

  function _encodeText(_inputText, _encodingId, _errorMode, _encodingsConfig)
  {
    if (_encodingId === "utf-8")
    {
      return window.CipherCoreTextUtf8.encode(_inputText);
    }
    if (_encodingId === "ascii")
    {
      return window.CipherCoreTextAscii.encode(_inputText, _errorMode);
    }
    if (_encodingId === "ebcdic-cp037")
    {
      return window.CipherCoreTextCp037.encode(_inputText, _errorMode, _encodingsConfig);
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
      return window.CipherCoreTextUtf8.decode(_byteValues, _errorMode);
    }
    if (_encodingId === "ascii")
    {
      return window.CipherCoreTextAscii.decode(_byteValues, _errorMode);
    }
    if (_encodingId === "ebcdic-cp037")
    {
      return window.CipherCoreTextCp037.decode(_byteValues, _errorMode, _encodingsConfig);
    }
    return {
      error: "Unsupported encoding.",
      text: ""
    };
  }

  window.CipherCoreText = {
    encodeText: _encodeText,
    decodeBytes: _decodeBytes,
    getEncodingDefinition: window.CipherCoreTextCp037.getEncodingDefinition
  };
}());

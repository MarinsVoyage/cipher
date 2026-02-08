(function ()
{
  "use strict";

  function _normalizeMessageList(_messageList)
  {
    return Array.isArray(_messageList) ? _messageList.slice(0) : [];
  }

  function _buildErrorResult(_errorMessage, _messageList)
  {
    var _combinedMessages = _normalizeMessageList(_messageList);
    if (typeof _errorMessage === "string" && _errorMessage.length > 0)
    {
      _combinedMessages.push(_errorMessage);
    }
    return {
      outputText: "",
      errors: _combinedMessages
    };
  }

  function _buildSuccessResult(_outputText, _messageList)
  {
    return {
      outputText: _outputText,
      errors: _normalizeMessageList(_messageList)
    };
  }

  function _runEncodeToFormatted(_inputText, _parameterValues, _configuration, _formatByteValues)
  {
    if (typeof _formatByteValues !== "function")
    {
      return _buildErrorResult("Tool formatter is missing.", []);
    }

    var _resolvedParameterValues = _parameterValues || {};
    var _resolvedConfiguration = _configuration || {};
    var _encodingResult = window.CipherCoreText.encodeText(_inputText, _resolvedParameterValues.encodingId, _resolvedParameterValues.errors, _resolvedConfiguration.encodings);
    if (_encodingResult.error)
    {
      return _buildErrorResult(_encodingResult.error, []);
    }

    var _formattedOutput = _formatByteValues(_encodingResult.bytes);
    return _buildSuccessResult(_formattedOutput, []);
  }

  function _runParsedToDecoded(_inputText, _parameterValues, _configuration, _parseBytes)
  {
    if (typeof _parseBytes !== "function")
    {
      return _buildErrorResult("Tool parser is missing.", []);
    }

    var _resolvedParameterValues = _parameterValues || {};
    var _resolvedConfiguration = _configuration || {};
    var _parseResult = _parseBytes(_inputText);
    var _parseMessages = _normalizeMessageList(_parseResult ? _parseResult.messages : []);
    if (!_parseResult)
    {
      return _buildErrorResult("Input could not be parsed.", _parseMessages);
    }
    if (_parseResult.error)
    {
      return _buildErrorResult(_parseResult.error, _parseMessages);
    }

    var _decodeResult = window.CipherCoreText.decodeBytes(_parseResult.bytes, _resolvedParameterValues.encodingId, _resolvedParameterValues.errors, _resolvedConfiguration.encodings);
    if (_decodeResult.error)
    {
      return _buildErrorResult(_decodeResult.error, _parseMessages);
    }

    return _buildSuccessResult(_decodeResult.text, _parseMessages);
  }

  window.CipherAppToolsConvertShared = {
    runEncodeToFormatted: _runEncodeToFormatted,
    runParsedToDecoded: _runParsedToDecoded
  };
}());

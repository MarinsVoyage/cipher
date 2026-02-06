(function ()
{
  "use strict";

  function _updateToolDetails(_userInterfaceElements, _toolDefinition, _configuration, _state, _eventHandlers)
  {
    if (!_toolDefinition)
    {
      return;
    }

    var _inputDefinition = _toolDefinition.input || {};
    var _outputDefinition = _toolDefinition.output || {};

    _userInterfaceElements.inputTitle.textContent = _inputDefinition.label || "Input";
    _userInterfaceElements.outputTitle.textContent = _outputDefinition.label || "Output";
    _userInterfaceElements.toolDescription.textContent = _toolDefinition.description || "";
    _userInterfaceElements.toolSelect.value = _toolDefinition.id;
    if (_userInterfaceElements.inputArea)
    {
      _userInterfaceElements.inputArea.placeholder = "Enter " + _userInterfaceElements.inputTitle.textContent.toLowerCase() + "...";
    }

    var _parameterValuesByToolIdentifier = _state && _state.parametersByToolIdentifier ? _state.parametersByToolIdentifier : {};
    var _parameterValues = _parameterValuesByToolIdentifier[_toolDefinition.id] || {};
    window.CipherAppRenderParameters.renderParameters(_userInterfaceElements, _toolDefinition, _parameterValues, _configuration, _eventHandlers);
  }

  function _updateOutput(_userInterfaceElements, _state)
  {
    _userInterfaceElements.outputArea.value = _state.outputText || "";
  }

  function _updateErrors(_userInterfaceElements, _state)
  {
    var _combinedMessages = [];
    var _messageIndex = 0;
    var _validationMessages = _state.validationMessages || [];
    var _conversionMessages = _state.conversionMessages || [];

    for (_messageIndex = 0; _messageIndex < _validationMessages.length; _messageIndex += 1)
    {
      _combinedMessages.push(_validationMessages[_messageIndex]);
    }

    for (_messageIndex = 0; _messageIndex < _conversionMessages.length; _messageIndex += 1)
    {
      _combinedMessages.push(_conversionMessages[_messageIndex]);
    }

    window.CipherCoreDom.clearChildren(_userInterfaceElements.errorList);

    if (_combinedMessages.length === 0)
    {
      return;
    }

    for (_messageIndex = 0; _messageIndex < _combinedMessages.length; _messageIndex += 1)
    {
      _userInterfaceElements.errorList.appendChild(window.CipherCoreDom.createElement("div", "error-item", _combinedMessages[_messageIndex]));
    }
  }

  function _updateInputCounter(_userInterfaceElements, _state, _configuration)
  {
    var _appConfiguration = _configuration && _configuration.app ? _configuration.app : {};
    var _maximumInputCharacters = _appConfiguration.maxInputChars || 0;
    var _inputText = _state && typeof _state.inputText === "string" ? _state.inputText : "";
    var _characterCount = window.CipherCoreValidate.countCharacters ? window.CipherCoreValidate.countCharacters(_inputText) : _inputText.length;
    var _countText = _characterCount + (_maximumInputCharacters > 0 ? " / " + _maximumInputCharacters : "");
    _userInterfaceElements.inputCounter.textContent = _countText;
    if (_maximumInputCharacters > 0)
    {
      _userInterfaceElements.inputHint.textContent = "Max " + _maximumInputCharacters + " characters";
    }
    else
    {
      _userInterfaceElements.inputHint.textContent = "";
    }
  }

  function _setCopyStatus(_userInterfaceElements, _status)
  {
    _userInterfaceElements.copyButton.classList.remove("is-success");
    _userInterfaceElements.copyButton.classList.remove("is-warning");

    if (_status === "success")
    {
      _userInterfaceElements.copyButton.textContent = "Copied";
      _userInterfaceElements.copyButton.classList.add("is-success");
      return;
    }

    if (_status === "error")
    {
      _userInterfaceElements.copyButton.textContent = "Copy failed";
      _userInterfaceElements.copyButton.classList.add("is-warning");
      return;
    }

    _userInterfaceElements.copyButton.textContent = "Copy";
  }

  function _setMobileLayout(_rootElement, _isMobile)
  {
    if (_isMobile)
    {
      _rootElement.classList.add("is-mobile");
    }
    else
    {
      _rootElement.classList.remove("is-mobile");
    }
  }

  window.CipherAppRenderUpdates = {
    updateToolDetails: _updateToolDetails,
    updateOutput: _updateOutput,
    updateErrors: _updateErrors,
    updateInputCounter: _updateInputCounter,
    setCopyStatus: _setCopyStatus,
    setMobileLayout: _setMobileLayout
  };
}());

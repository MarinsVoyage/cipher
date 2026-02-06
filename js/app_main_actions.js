(function ()
{
  "use strict";

  function _getToolList(_runtime)
  {
    var _configuration = _runtime && _runtime.configuration ? _runtime.configuration : {};
    return Array.isArray(_configuration.tools) ? _configuration.tools : [];
  }

  function _getActiveToolDefinition(_runtime)
  {
    var _toolList = _getToolList(_runtime);
    var _state = _runtime && _runtime.state ? _runtime.state : {};
    var _toolDefinition = window.CipherAppState.getToolByIdentifier(_toolList, _state.selectedToolIdentifier);
    if (!_toolDefinition && _toolList.length > 0)
    {
      _toolDefinition = _toolList[0];
    }
    return _toolDefinition;
  }

  function _getAppConfiguration(_runtime)
  {
    return _runtime && _runtime.configuration && _runtime.configuration.app ? _runtime.configuration.app : {};
  }

  function _setCopyStatus(_runtime, _copyStatus)
  {
    _runtime.state.ui.copyStatus = _copyStatus;
    _runtime.renderInterface.setCopyStatus(_copyStatus);

    if (_runtime.copyResetTimer)
    {
      window.clearTimeout(_runtime.copyResetTimer);
    }

    if (_copyStatus !== "idle")
    {
      _runtime.copyResetTimer = window.setTimeout(function ()
      {
        _runtime.state.ui.copyStatus = "idle";
        _runtime.renderInterface.setCopyStatus("idle");
      }, 1500);
    }
  }

  function _runConversion(_runtime)
  {
    var _toolDefinition = _getActiveToolDefinition(_runtime);
    if (!_toolDefinition)
    {
      _runtime.state.outputText = "";
      _runtime.state.conversionMessages = ["Tool configuration is missing."];
      _runtime.renderInterface.updateOutput(_runtime.state);
      _runtime.renderInterface.updateErrors(_runtime.state);
      return;
    }

    var _parametersByToolIdentifier = _runtime.state.parametersByToolIdentifier || {};
    var _parameterValues = _parametersByToolIdentifier[_toolDefinition.id] || {};
    var _conversionResult = window.CipherAppToolsConvert.runTool(_toolDefinition.id, _runtime.state.inputText, _parameterValues, _runtime.configuration);

    _runtime.state.outputText = _conversionResult.outputText;
    _runtime.state.conversionMessages = _conversionResult.errors || [];

    _runtime.renderInterface.updateOutput(_runtime.state);
    _runtime.renderInterface.updateErrors(_runtime.state);
  }

  function _applyMobileLayout(_runtime)
  {
    var _appConfiguration = _getAppConfiguration(_runtime);
    var _uiConfiguration = _appConfiguration.ui || {};
    var _responsiveConfiguration = _uiConfiguration.responsive || {};
    var _mobileBreakpointPixels = _responsiveConfiguration.mobileBreakpointPx || 860;
    var _isMobileLayout = window.innerWidth <= _mobileBreakpointPixels;
    _runtime.state.ui.isMobile = _isMobileLayout;
    _runtime.renderInterface.setMobileLayout(_isMobileLayout);
  }

  function _indexParametersById(_toolDefinition)
  {
    var _parameterIndexMap = {};
    var _parameterList = _toolDefinition && _toolDefinition.parameters ? _toolDefinition.parameters : [];
    var _parameterIndex = 0;
    for (_parameterIndex = 0; _parameterIndex < _parameterList.length; _parameterIndex += 1)
    {
      _parameterIndexMap[_parameterList[_parameterIndex].id] = _parameterList[_parameterIndex];
    }
    return _parameterIndexMap;
  }

  function _createEventHandlers(_runtime)
  {
    function _handleCopyOutput()
    {
      var _outputText = _runtime.state.outputText || "";
      if (_outputText.length === 0)
      {
        _setCopyStatus(_runtime, "error");
        return;
      }

      if (navigator.clipboard && navigator.clipboard.writeText)
      {
        navigator.clipboard.writeText(_outputText)
          .then(function ()
          {
            _setCopyStatus(_runtime, "success");
          })
          .catch(function ()
          {
            _setCopyStatus(_runtime, "error");
          });
        return;
      }

      _setCopyStatus(_runtime, "error");
    }

    function _handleInputChange(_inputText)
    {
      var _appConfiguration = _getAppConfiguration(_runtime);
      var _maximumCharacters = _appConfiguration.maxInputChars;
      var _validationResult = window.CipherCoreValidate.enforceMaxInput(_inputText, _maximumCharacters);

      if (_validationResult.wasTrimmed)
      {
        _runtime.state.validationMessages = ["Input was trimmed to " + _maximumCharacters + " characters."];
      }
      else
      {
        _runtime.state.validationMessages = [];
      }

      _runtime.state.inputText = _validationResult.value;
      window.CipherAppState.saveInputText(_runtime.configuration, _runtime.state.inputText);

      if (_validationResult.wasTrimmed)
      {
        _runtime.renderInterface.setInputValue(_validationResult.value);
      }

      _runtime.renderInterface.updateInputCounter(_runtime.state);
      _runConversion(_runtime);
    }

    function _handleSelectTool(_toolIdentifier)
    {
      if (!window.CipherAppState.getToolByIdentifier(_getToolList(_runtime), _toolIdentifier))
      {
        return;
      }

      _runtime.state.selectedToolIdentifier = _toolIdentifier;

      var _appConfiguration = _getAppConfiguration(_runtime);
      var _uiConfiguration = _appConfiguration.ui || {};
      if (_uiConfiguration.rememberLastTool === true)
      {
        window.CipherAppState.saveSelectedTool(_runtime.configuration, _toolIdentifier);
      }

      _runtime.renderInterface.renderToolDetails(_runtime.state);
      _runConversion(_runtime);
    }

    function _handleParamChange(_toolIdentifier, _parameterDefinition, _rawValue)
    {
      var _normalizedValue = window.CipherAppState.normalizeParameterValue(_parameterDefinition, _rawValue);
      if (!_runtime.state.parametersByToolIdentifier[_toolIdentifier])
      {
        _runtime.state.parametersByToolIdentifier[_toolIdentifier] = {};
      }
      _runtime.state.parametersByToolIdentifier[_toolIdentifier][_parameterDefinition.id] = _normalizedValue;
      window.CipherAppState.saveParameters(_runtime.configuration, _runtime.state.parametersByToolIdentifier);
      _runConversion(_runtime);
    }

    function _handleSwapOutput()
    {
      var _currentToolDefinition = _getActiveToolDefinition(_runtime);
      if (!_currentToolDefinition)
      {
        return;
      }

      var _candidateToolIdentifier = _currentToolDefinition.reverseToolIdentifier ? _currentToolDefinition.reverseToolIdentifier : _runtime.state.selectedToolIdentifier;
      var _nextToolDefinition = window.CipherAppState.getToolByIdentifier(_getToolList(_runtime), _candidateToolIdentifier);

      if (_nextToolDefinition && _nextToolDefinition.id !== _runtime.state.selectedToolIdentifier)
      {
        var _currentParameterValues = _runtime.state.parametersByToolIdentifier[_currentToolDefinition.id] || {};
        var _nextParameterValues = _runtime.state.parametersByToolIdentifier[_nextToolDefinition.id] || {};
        var _currentParameterIndex = _indexParametersById(_currentToolDefinition);
        var _nextParameterList = _nextToolDefinition.parameters || [];
        var _parameterIndex = 0;

        for (_parameterIndex = 0; _parameterIndex < _nextParameterList.length; _parameterIndex += 1)
        {
          var _nextParameterDefinition = _nextParameterList[_parameterIndex];
          if (_currentParameterIndex[_nextParameterDefinition.id])
          {
            var _candidateValue = _currentParameterValues[_nextParameterDefinition.id];
            _nextParameterValues[_nextParameterDefinition.id] = window.CipherAppState.normalizeParameterValue(_nextParameterDefinition, _candidateValue);
          }
        }

        _runtime.state.parametersByToolIdentifier[_nextToolDefinition.id] = _nextParameterValues;
        window.CipherAppState.saveParameters(_runtime.configuration, _runtime.state.parametersByToolIdentifier);

        _runtime.state.selectedToolIdentifier = _nextToolDefinition.id;
        var _appConfiguration = _getAppConfiguration(_runtime);
        var _uiConfiguration = _appConfiguration.ui || {};
        if (_uiConfiguration.rememberLastTool === true)
        {
          window.CipherAppState.saveSelectedTool(_runtime.configuration, _nextToolDefinition.id);
        }
        _runtime.renderInterface.renderToolDetails(_runtime.state);
      }

      var _nextInputText = _runtime.state.outputText || "";
      var _conversionMessageList = _runtime.state.conversionMessages || [];
      if (_conversionMessageList.length > 0 && _nextInputText.length === 0)
      {
        return;
      }

      _handleInputChange(_nextInputText);
      _runtime.renderInterface.setInputValue(_runtime.state.inputText);
    }

    return {
      onSelectTool: _handleSelectTool,
      onInputChange: _handleInputChange,
      onParamChange: _handleParamChange,
      onCopyOutput: _handleCopyOutput,
      onSwapOutput: _handleSwapOutput
    };
  }

  window.CipherAppMainActions = {
    applyMobileLayout: _applyMobileLayout,
    createEventHandlers: _createEventHandlers
  };
}());

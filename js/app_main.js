(function ()
{
  "use strict";

  var _configuration = null;
  var _state = null;
  var _renderInterface = null;
  var _copyResetTimer = null;

  function _isHttpProtocol()
  {
    return window.location.protocol === "http:" || window.location.protocol === "https:";
  }

  function _fetchJson(_url)
  {
    return fetch(_url, { cache: "no-store" }).then(function (_response)
    {
      if (!_response.ok)
      {
        throw new Error("Request failed.");
      }
      return _response.json();
    });
  }

  function _loadConfigFromManifest(_manifest)
  {
    if (!_manifest || !_manifest.files)
    {
      return Promise.reject(new Error("Config manifest is incorrect."));
    }

    var _requiredConfigKeys = ["app", "encodings", "tools"];
    var _fetchPromises = [];
    var _keyIndex = 0;

    for (_keyIndex = 0; _keyIndex < _requiredConfigKeys.length; _keyIndex += 1)
    {
      var _configKey = _requiredConfigKeys[_keyIndex];
      var _filePath = _manifest.files[_configKey];
      if (!_filePath)
      {
        return Promise.reject(new Error("Config manifest missing files."));
      }
      _fetchPromises.push(_fetchJson(_filePath));
    }

    return Promise.all(_fetchPromises).then(function (_results)
    {
      var _loadedConfig = {};
      for (_keyIndex = 0; _keyIndex < _requiredConfigKeys.length; _keyIndex += 1)
      {
        _loadedConfig[_requiredConfigKeys[_keyIndex]] = _results[_keyIndex];
      }
      _loadedConfig.manifest = _manifest;
      return _loadedConfig;
    });
  }

  function _loadConfig(_onDone)
  {
    var _embeddedConfiguration = window.CipherConfig;

    if (!_isHttpProtocol())
    {
      _onDone(_embeddedConfiguration, null);
      return;
    }

    _fetchJson("config_manifest.json")
      .then(function (_manifest)
      {
        return _loadConfigFromManifest(_manifest);
      })
      .then(function (_loadedConfiguration)
      {
        _onDone(_loadedConfiguration, null);
      })
      .catch(function ()
      {
        _onDone(_embeddedConfiguration, "Configuration fetch failed. Using embedded configuration.");
      });
  }

  function _showFatalError(_message)
  {
    var _rootElement = window.CipherCoreDom.byId("app");
    window.CipherCoreDom.clearChildren(_rootElement);
    var _panelElement = window.CipherCoreDom.createElement("div", "panel");
    _panelElement.appendChild(window.CipherCoreDom.createElement("div", "panel-title", "Loading failed"));
    _panelElement.appendChild(window.CipherCoreDom.createElement("div", "panel-meta", _message));
    _rootElement.appendChild(_panelElement);
  }

  function _applyMobileLayout()
  {
    var _mobileBreakpointPixels = _configuration.app.ui.responsive.mobileBreakpointPx || 860;
    var _isMobileLayout = window.innerWidth <= _mobileBreakpointPixels;
    _state.ui.isMobile = _isMobileLayout;
    _renderInterface.setMobileLayout(_isMobileLayout);
  }

  function _runConversion()
  {
    var _toolDefinition = window.CipherAppState.getToolByIdentifier(_configuration.tools, _state.selectedToolIdentifier) || _configuration.tools[0];
    var _parameterValues = _state.parametersByToolIdentifier[_toolDefinition.id];
    var _conversionResult = window.CipherAppToolsConvert.runTool(_toolDefinition.id, _state.inputText, _parameterValues, _configuration);

    _state.outputText = _conversionResult.outputText;
    _state.conversionMessages = _conversionResult.errors || [];

    _renderInterface.updateOutput(_state);
    _renderInterface.updateErrors(_state);
  }

  function _setCopyStatus(_copyStatus)
  {
    _state.ui.copyStatus = _copyStatus;
    _renderInterface.setCopyStatus(_copyStatus);

    if (_copyResetTimer)
    {
      window.clearTimeout(_copyResetTimer);
    }

    if (_copyStatus !== "idle")
    {
      _copyResetTimer = window.setTimeout(function ()
      {
        _state.ui.copyStatus = "idle";
        _renderInterface.setCopyStatus("idle");
      }, 1500);
    }
  }

  function _handleCopyOutput()
  {
    var _outputText = _state.outputText || "";
    if (_outputText.length === 0)
    {
      _setCopyStatus("error");
      return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText)
    {
      navigator.clipboard.writeText(_outputText)
        .then(function ()
        {
          _setCopyStatus("success");
        })
        .catch(function ()
        {
          _setCopyStatus("error");
        });
      return;
    }

    _setCopyStatus("error");
  }

  function _handleInputChange(_inputText)
  {
    var _validationResult = window.CipherCoreValidate.enforceMaxInput(_inputText, _configuration.app.maxInputChars);

    if (_validationResult.wasTrimmed)
    {
      _state.validationMessages = ["Input was trimmed to " + _configuration.app.maxInputChars + " characters."];
    }
    else
    {
      _state.validationMessages = [];
    }

    _state.inputText = _validationResult.value;
    window.CipherAppState.saveInputText(_configuration, _state.inputText);

    if (_validationResult.wasTrimmed)
    {
      _renderInterface.setInputValue(_validationResult.value);
    }

    _renderInterface.updateInputCounter(_state);
    _runConversion();
  }

  function _handleSelectTool(_toolIdentifier)
  {
    if (!window.CipherAppState.getToolByIdentifier(_configuration.tools, _toolIdentifier))
    {
      return;
    }

    _state.selectedToolIdentifier = _toolIdentifier;
    if (_configuration.app.ui.rememberLastTool === true)
    {
      window.CipherAppState.saveSelectedTool(_configuration, _toolIdentifier);
    }

    _renderInterface.renderToolDetails(_state);
    _runConversion();
  }

  function _handleParamChange(_toolIdentifier, _parameterDefinition, _rawValue)
  {
    var _normalizedValue = window.CipherAppState.normalizeParameterValue(_parameterDefinition, _rawValue);
    _state.parametersByToolIdentifier[_toolIdentifier][_parameterDefinition.id] = _normalizedValue;
    window.CipherAppState.saveParameters(_configuration, _state.parametersByToolIdentifier);
    _runConversion();
  }

  function _indexParametersById(_toolDefinition)
  {
    var _parameterIndexMap = {};
    if (!_toolDefinition || !_toolDefinition.parameters)
    {
      return _parameterIndexMap;
    }

    var _parameterIndex = 0;
    for (_parameterIndex = 0; _parameterIndex < _toolDefinition.parameters.length; _parameterIndex += 1)
    {
      _parameterIndexMap[_toolDefinition.parameters[_parameterIndex].id] = _toolDefinition.parameters[_parameterIndex];
    }
    return _parameterIndexMap;
  }

  function _handleSwapOutput()
  {
    var _currentToolDefinition = window.CipherAppState.getToolByIdentifier(_configuration.tools, _state.selectedToolIdentifier) || _configuration.tools[0];
    var _candidateToolIdentifier = _currentToolDefinition && _currentToolDefinition.reverseToolIdentifier ? _currentToolDefinition.reverseToolIdentifier : _state.selectedToolIdentifier;
    var _nextToolDefinition = window.CipherAppState.getToolByIdentifier(_configuration.tools, _candidateToolIdentifier);

    if (_nextToolDefinition && _nextToolDefinition.id !== _state.selectedToolIdentifier)
    {
      var _currentParameterValues = _state.parametersByToolIdentifier[_currentToolDefinition.id] || {};
      var _nextParameterValues = _state.parametersByToolIdentifier[_nextToolDefinition.id] || {};
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

      _state.parametersByToolIdentifier[_nextToolDefinition.id] = _nextParameterValues;
      window.CipherAppState.saveParameters(_configuration, _state.parametersByToolIdentifier);

      _state.selectedToolIdentifier = _nextToolDefinition.id;
      if (_configuration.app.ui.rememberLastTool === true)
      {
        window.CipherAppState.saveSelectedTool(_configuration, _nextToolDefinition.id);
      }
      _renderInterface.renderToolDetails(_state);
    }

    _handleInputChange(_state.outputText || "");
    _renderInterface.setInputValue(_state.inputText);
  }

  function _start()
  {
    _loadConfig(function (_loadedConfiguration, _warning)
    {
      if (!_loadedConfiguration || !_loadedConfiguration.app)
      {
        _showFatalError("Configuration could not be loaded.");
        return;
      }

      _configuration = _loadedConfiguration;
      if (_configuration.app && _configuration.app.appName)
      {
        document.title = _configuration.app.appName;
      }
      _state = window.CipherAppState.create(_configuration);

      var _eventHandlers = {
        onSelectTool: _handleSelectTool,
        onInputChange: _handleInputChange,
        onParamChange: _handleParamChange,
        onCopyOutput: _handleCopyOutput,
        onSwapOutput: _handleSwapOutput
      };

      _renderInterface = window.CipherAppRender.init(window.CipherCoreDom.byId("app"), _configuration, _state, _eventHandlers);
      _renderInterface.setInputValue(_state.inputText);
      _applyMobileLayout();
      _handleInputChange(_state.inputText);

      if (_warning)
      {
        _state.validationMessages = [_warning].concat(_state.validationMessages);
        _renderInterface.updateErrors(_state);
      }

      window.addEventListener("resize", function ()
      {
        _applyMobileLayout();
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function ()
  {
    _start();
  });

  window.CipherAppMain = {
    start: _start
  };
}());

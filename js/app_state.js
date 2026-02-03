(function ()
{
  "use strict";

  function _safeReadLocalStorage(_storageKey)
  {
    try
    {
      return window.localStorage.getItem(_storageKey);
    }
    catch (_storageError)
    {
      return null;
    }
  }

  function _safeWriteLocalStorage(_storageKey, _storageValue)
  {
    try
    {
      window.localStorage.setItem(_storageKey, _storageValue);
    }
    catch (_storageError)
    {
      return;
    }
  }

  function _getToolByIdentifier(_toolList, _toolIdentifier)
  {
    var _toolIndex = 0;
    for (_toolIndex = 0; _toolIndex < _toolList.length; _toolIndex += 1)
    {
      if (_toolList[_toolIndex].id === _toolIdentifier)
      {
        return _toolList[_toolIndex];
      }
    }
    return null;
  }

  function _normalizeParameterValue(_parameterDefinition, _rawValue)
  {
    if (_parameterDefinition.type === "boolean")
    {
      return _rawValue === true || _rawValue === "true";
    }

    if (_parameterDefinition.type === "select")
    {
      var _optionIndex = 0;
      for (_optionIndex = 0; _optionIndex < _parameterDefinition.options.length; _optionIndex += 1)
      {
        if (String(_parameterDefinition.options[_optionIndex]) === String(_rawValue))
        {
          return _parameterDefinition.options[_optionIndex];
        }
      }
      return _parameterDefinition.default;
    }

    if (_parameterDefinition.type === "integer")
    {
      var _numberValue = parseInt(_rawValue, 10);
      if (Number.isNaN(_numberValue))
      {
        return _parameterDefinition.default;
      }
      return _numberValue;
    }

    return _rawValue !== undefined ? _rawValue : _parameterDefinition.default;
  }

  function _buildDefaultParameters(_toolDefinition)
  {
    var _defaultParameters = {};
    var _parameterIndex = 0;
    if (!_toolDefinition.parameters)
    {
      return _defaultParameters;
    }
    for (_parameterIndex = 0; _parameterIndex < _toolDefinition.parameters.length; _parameterIndex += 1)
    {
      _defaultParameters[_toolDefinition.parameters[_parameterIndex].id] = _toolDefinition.parameters[_parameterIndex].default;
    }
    return _defaultParameters;
  }

  function _mergeParameters(_toolDefinition, _storedParameters)
  {
    var _mergedParameters = _buildDefaultParameters(_toolDefinition);
    var _parameterIndex = 0;
    if (!_toolDefinition.parameters)
    {
      return _mergedParameters;
    }
    for (_parameterIndex = 0; _parameterIndex < _toolDefinition.parameters.length; _parameterIndex += 1)
    {
      var _parameterDefinition = _toolDefinition.parameters[_parameterIndex];
      if (_storedParameters && _storedParameters[_parameterDefinition.id] !== undefined)
      {
        _mergedParameters[_parameterDefinition.id] = _normalizeParameterValue(_parameterDefinition, _storedParameters[_parameterDefinition.id]);
      }
    }
    return _mergedParameters;
  }

  function _loadStoredParameters(_storageKey)
  {
    var _rawStoredParameters = _safeReadLocalStorage(_storageKey);
    if (!_rawStoredParameters)
    {
      return null;
    }
    try
    {
      return JSON.parse(_rawStoredParameters);
    }
    catch (_parseError)
    {
      return null;
    }
  }

  function _buildParametersByToolIdentifier(_toolList, _storedParameters)
  {
    var _parametersByToolIdentifier = {};
    var _toolIndex = 0;
    for (_toolIndex = 0; _toolIndex < _toolList.length; _toolIndex += 1)
    {
      var _toolDefinition = _toolList[_toolIndex];
      var _storedToolParameters = _storedParameters ? _storedParameters[_toolDefinition.id] : null;
      _parametersByToolIdentifier[_toolDefinition.id] = _mergeParameters(_toolDefinition, _storedToolParameters);
    }
    return _parametersByToolIdentifier;
  }

  function _createState(_configuration)
  {
    var _toolList = _configuration.tools || [];
    var _storageKeys = _configuration.app.storage.localStorageKeys || {};
    var _storedParameters = _loadStoredParameters(_storageKeys.lastParams);
    var _selectedToolIdentifier = _configuration.app.defaultToolId;
    var _shouldRememberTool = _configuration.app.ui.rememberLastTool === true;

    if (_shouldRememberTool)
    {
      var _storedToolIdentifier = _safeReadLocalStorage(_storageKeys.selectedToolId);
      if (_storedToolIdentifier && _getToolByIdentifier(_toolList, _storedToolIdentifier))
      {
        _selectedToolIdentifier = _storedToolIdentifier;
      }
    }

    if (!_getToolByIdentifier(_toolList, _selectedToolIdentifier) && _toolList.length > 0)
    {
      _selectedToolIdentifier = _toolList[0].id;
    }

    var _inputText = "";
    var _storedInputText = _safeReadLocalStorage(_storageKeys.lastInput);
    if (typeof _storedInputText === "string")
    {
      _inputText = _storedInputText;
    }

    return {
      selectedToolIdentifier: _selectedToolIdentifier,
      inputText: _inputText,
      outputText: "",
      parametersByToolIdentifier: _buildParametersByToolIdentifier(_toolList, _storedParameters),
      validationMessages: [],
      conversionMessages: [],
      ui: {
        isMobile: false,
        copyStatus: "idle"
      }
    };
  }

  function _saveSelectedTool(_configuration, _selectedToolIdentifier)
  {
    var _storageKeys = _configuration.app.storage.localStorageKeys || {};
    _safeWriteLocalStorage(_storageKeys.selectedToolId, _selectedToolIdentifier);
  }

  function _saveInputText(_configuration, _inputText)
  {
    var _storageKeys = _configuration.app.storage.localStorageKeys || {};
    _safeWriteLocalStorage(_storageKeys.lastInput, _inputText);
  }

  function _saveParameters(_configuration, _parametersByToolIdentifier)
  {
    var _storageKeys = _configuration.app.storage.localStorageKeys || {};
    _safeWriteLocalStorage(_storageKeys.lastParams, JSON.stringify(_parametersByToolIdentifier));
  }

  window.CipherAppState = {
    create: _createState,
    getToolByIdentifier: _getToolByIdentifier,
    normalizeParameterValue: _normalizeParameterValue,
    saveSelectedTool: _saveSelectedTool,
    saveInputText: _saveInputText,
    saveParameters: _saveParameters
  };
}());

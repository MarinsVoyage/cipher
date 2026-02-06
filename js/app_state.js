(function ()
{
  "use strict";

  function _createState(_configuration)
  {
    var _toolList = _configuration && Array.isArray(_configuration.tools) ? _configuration.tools : [];
    var _appConfiguration = _configuration && _configuration.app ? _configuration.app : {};
    var _uiConfiguration = _appConfiguration.ui || {};
    var _storageKeys = window.CipherAppStateStorage.getLocalStorageKeys(_configuration);
    var _storedParameters = window.CipherAppStateStorage.loadStoredParameters(_storageKeys.lastParams);
    var _selectedToolIdentifier = _appConfiguration.defaultToolId || "";
    var _shouldRememberTool = _uiConfiguration.rememberLastTool === true;

    if (_shouldRememberTool)
    {
      var _storedToolIdentifier = window.CipherAppStateStorage.safeReadLocalStorage(_storageKeys.selectedToolId);
      if (_storedToolIdentifier && window.CipherAppStateParameters.getToolByIdentifier(_toolList, _storedToolIdentifier))
      {
        _selectedToolIdentifier = _storedToolIdentifier;
      }
    }

    if (!window.CipherAppStateParameters.getToolByIdentifier(_toolList, _selectedToolIdentifier) && _toolList.length > 0)
    {
      _selectedToolIdentifier = _toolList[0].id;
    }

    var _inputText = "";
    var _storedInputText = window.CipherAppStateStorage.safeReadLocalStorage(_storageKeys.lastInput);
    if (typeof _storedInputText === "string")
    {
      _inputText = _storedInputText;
    }

    return {
      selectedToolIdentifier: _selectedToolIdentifier,
      inputText: _inputText,
      outputText: "",
      parametersByToolIdentifier: window.CipherAppStateParameters.buildParametersByToolIdentifier(_toolList, _storedParameters),
      validationMessages: [],
      conversionMessages: [],
      ui: {
        isMobile: false,
        copyStatus: "idle"
      }
    };
  }

  window.CipherAppState = {
    create: _createState,
    getToolByIdentifier: window.CipherAppStateParameters.getToolByIdentifier,
    normalizeParameterValue: window.CipherAppStateParameters.normalizeParameterValue,
    saveSelectedTool: window.CipherAppStateStorage.saveSelectedTool,
    saveInputText: window.CipherAppStateStorage.saveInputText,
    saveParameters: window.CipherAppStateStorage.saveParameters
  };
}());

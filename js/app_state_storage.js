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

  function _getLocalStorageKeys(_configuration)
  {
    var _appConfiguration = _configuration && _configuration.app ? _configuration.app : {};
    var _storageConfiguration = _appConfiguration.storage || {};
    return _storageConfiguration.localStorageKeys || {};
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

  function _saveSelectedTool(_configuration, _selectedToolIdentifier)
  {
    var _storageKeys = _getLocalStorageKeys(_configuration);
    _safeWriteLocalStorage(_storageKeys.selectedToolId, _selectedToolIdentifier);
  }

  function _saveInputText(_configuration, _inputText)
  {
    var _storageKeys = _getLocalStorageKeys(_configuration);
    _safeWriteLocalStorage(_storageKeys.lastInput, _inputText);
  }

  function _saveParameters(_configuration, _parametersByToolIdentifier)
  {
    var _storageKeys = _getLocalStorageKeys(_configuration);
    _safeWriteLocalStorage(_storageKeys.lastParams, JSON.stringify(_parametersByToolIdentifier));
  }

  window.CipherAppStateStorage = {
    safeReadLocalStorage: _safeReadLocalStorage,
    getLocalStorageKeys: _getLocalStorageKeys,
    loadStoredParameters: _loadStoredParameters,
    saveSelectedTool: _saveSelectedTool,
    saveInputText: _saveInputText,
    saveParameters: _saveParameters
  };
}());

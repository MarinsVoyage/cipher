(function ()
{
  "use strict";

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

  window.CipherAppMainConfig = {
    loadConfig: _loadConfig
  };
}());

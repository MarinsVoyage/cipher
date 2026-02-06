(function ()
{
  "use strict";

  function _showFatalError(_message)
  {
    var _rootElement = window.CipherCoreDom.byId("app");
    if (!_rootElement)
    {
      return;
    }

    window.CipherCoreDom.clearChildren(_rootElement);
    var _panelElement = window.CipherCoreDom.createElement("div", "panel");
    _panelElement.appendChild(window.CipherCoreDom.createElement("div", "panel-title", "Loading failed"));
    _panelElement.appendChild(window.CipherCoreDom.createElement("div", "panel-meta", _message));
    _rootElement.appendChild(_panelElement);
  }

  function _hasConfiguredTools(_configuration)
  {
    return _configuration && Array.isArray(_configuration.tools) && _configuration.tools.length > 0;
  }

  function _start()
  {
    window.CipherAppMainConfig.loadConfig(function (_loadedConfiguration, _warning)
    {
      if (!_loadedConfiguration || !_loadedConfiguration.app)
      {
        _showFatalError("Configuration could not be loaded.");
        return;
      }

      if (!_hasConfiguredTools(_loadedConfiguration))
      {
        _showFatalError("No tools are configured.");
        return;
      }

      if (_loadedConfiguration.app.appName)
      {
        document.title = _loadedConfiguration.app.appName;
      }

      var _runtime = {
        configuration: _loadedConfiguration,
        state: window.CipherAppState.create(_loadedConfiguration),
        renderInterface: null,
        copyResetTimer: null
      };

      var _eventHandlers = window.CipherAppMainActions.createEventHandlers(_runtime);
      var _rootElement = window.CipherCoreDom.byId("app");
      if (!_rootElement)
      {
        return;
      }

      _runtime.renderInterface = window.CipherAppRender.init(_rootElement, _runtime.configuration, _runtime.state, _eventHandlers);
      _runtime.renderInterface.setInputValue(_runtime.state.inputText);
      window.CipherAppMainActions.applyMobileLayout(_runtime);
      _eventHandlers.onInputChange(_runtime.state.inputText);

      if (_warning)
      {
        _runtime.state.validationMessages = [_warning].concat(_runtime.state.validationMessages);
        _runtime.renderInterface.updateErrors(_runtime.state);
      }

      window.addEventListener("resize", function ()
      {
        window.CipherAppMainActions.applyMobileLayout(_runtime);
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

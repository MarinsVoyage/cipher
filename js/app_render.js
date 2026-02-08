(function ()
{
  "use strict";

  function _getActiveToolDefinition(_configuration, _state)
  {
    var _toolList = _configuration && Array.isArray(_configuration.tools) ? _configuration.tools : [];
    var _selectedToolIdentifier = _state ? _state.selectedToolIdentifier : "";
    return window.CipherAppState.resolveActiveToolDefinition(_toolList, _selectedToolIdentifier);
  }

  function _init(_rootElement, _configuration, _state, _eventHandlers)
  {
    window.CipherCoreDom.clearChildren(_rootElement);

    var _userInterfaceElements = {};
    var _workspaceElement = window.CipherCoreDom.createElement("div", "workspace");

    _workspaceElement.appendChild(window.CipherAppRenderBuilders.buildToolSelectorPanel(_userInterfaceElements, _eventHandlers, _configuration));
    _workspaceElement.appendChild(window.CipherAppRenderBuilders.buildInputPanel(_userInterfaceElements, _eventHandlers, _configuration));
    _workspaceElement.appendChild(window.CipherAppRenderBuilders.buildParameterPanel(_userInterfaceElements));
    _workspaceElement.appendChild(window.CipherAppRenderBuilders.buildOutputPanel(_userInterfaceElements, _eventHandlers, _configuration));

    _rootElement.appendChild(_workspaceElement);

    _rootElement.addEventListener("click", function (_event)
    {
      var _target = _event.target;
      var _isInfoIcon = _target && _target.classList && _target.classList.contains("info-icon");
      if (_isInfoIcon)
      {
        return;
      }

      var _openIcons = _rootElement.querySelectorAll(".info-icon.is-open");
      _openIcons.forEach(function (_openIcon)
      {
        _openIcon.classList.remove("is-open");
        _openIcon.setAttribute("aria-expanded", "false");
      });
    });

    var _toolDefinition = _getActiveToolDefinition(_configuration, _state);
    window.CipherAppRenderUpdates.updateToolDetails(_userInterfaceElements, _toolDefinition, _configuration, _state, _eventHandlers);
    window.CipherAppRenderUpdates.updateOutput(_userInterfaceElements, _state);
    window.CipherAppRenderUpdates.updateErrors(_userInterfaceElements, _state);
    window.CipherAppRenderUpdates.updateInputCounter(_userInterfaceElements, _state, _configuration);
    window.CipherAppRenderUpdates.setCopyStatus(_userInterfaceElements, _state.ui.copyStatus);

    return {
      elements: _userInterfaceElements,
      renderToolDetails: function (_nextState)
      {
        var _nextToolDefinition = _getActiveToolDefinition(_configuration, _nextState);
        window.CipherAppRenderUpdates.updateToolDetails(_userInterfaceElements, _nextToolDefinition, _configuration, _nextState, _eventHandlers);
      },
      updateOutput: function (_nextState)
      {
        window.CipherAppRenderUpdates.updateOutput(_userInterfaceElements, _nextState);
      },
      updateErrors: function (_nextState)
      {
        window.CipherAppRenderUpdates.updateErrors(_userInterfaceElements, _nextState);
      },
      updateInputCounter: function (_nextState)
      {
        window.CipherAppRenderUpdates.updateInputCounter(_userInterfaceElements, _nextState, _configuration);
      },
      setCopyStatus: function (_status)
      {
        window.CipherAppRenderUpdates.setCopyStatus(_userInterfaceElements, _status);
      },
      setMobileLayout: function (_isMobile)
      {
        window.CipherAppRenderUpdates.setMobileLayout(_rootElement, _isMobile);
        window.CipherAppRenderTooltips.positionInfoTooltipsInRoot(_rootElement);
      },
      setInputValue: function (_value)
      {
        _userInterfaceElements.inputArea.value = _value;
      },
      selectOutput: function ()
      {
        if (!_userInterfaceElements.outputArea)
        {
          return;
        }

        _userInterfaceElements.outputArea.focus();
        _userInterfaceElements.outputArea.select();
        if (typeof _userInterfaceElements.outputArea.setSelectionRange === "function")
        {
          _userInterfaceElements.outputArea.setSelectionRange(0, _userInterfaceElements.outputArea.value.length);
        }
      }
    };
  }

  window.CipherAppRender = {
    init: _init
  };
}());

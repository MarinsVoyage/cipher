(function ()
{
  "use strict";

  function _formatOptionLabel(_parameterDefinition, _optionValue, _configuration)
  {
    if (_parameterDefinition.id === "encodingId")
    {
      var _encodingDefinition = window.CipherCoreText.getEncodingDefinition(_configuration.encodings, String(_optionValue));
      if (_encodingDefinition && _encodingDefinition.title)
      {
        return _encodingDefinition.title;
      }
    }

    if (_parameterDefinition.id === "errors")
    {
      var _errorLabel = String(_optionValue);
      return _errorLabel.charAt(0).toUpperCase() + _errorLabel.slice(1);
    }

    if (_parameterDefinition.id === "groupSizeBits")
    {
      return String(_optionValue) + " bits";
    }

    if (_parameterDefinition.id === "separator")
    {
      if (_optionValue === "")
      {
        return "None";
      }
      if (_optionValue === " ")
      {
        return "Space";
      }
    }

    return String(_optionValue);
  }

  function _getTooltipViewportPadding()
  {
    var _rootStyles = window.getComputedStyle(document.documentElement);
    var _paddingValue = _rootStyles.getPropertyValue("--tooltip-viewport-padding");
    var _parsedPadding = parseFloat(_paddingValue);
    if (Number.isNaN(_parsedPadding))
    {
      return 0;
    }
    return _parsedPadding;
  }

  function _positionInfoTooltip(_buttonElement)
  {
    if (!_buttonElement)
    {
      return;
    }

    var _tooltipElement = _buttonElement.querySelector(".info-tooltip");
    if (!_tooltipElement)
    {
      return;
    }

    _tooltipElement.style.setProperty("--tooltip-shift", "0px");

    var _viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
    if (_viewportWidth <= 0)
    {
      return;
    }

    var _viewportPadding = _getTooltipViewportPadding();
    var _tooltipRect = _tooltipElement.getBoundingClientRect();
    var _leftOverflow = _viewportPadding - _tooltipRect.left;
    var _rightOverflow = _tooltipRect.right - (_viewportWidth - _viewportPadding);

    if (_leftOverflow > 0)
    {
      _tooltipElement.style.setProperty("--tooltip-shift", _leftOverflow + "px");
      return;
    }

    if (_rightOverflow > 0)
    {
      _tooltipElement.style.setProperty("--tooltip-shift", "-" + _rightOverflow + "px");
      return;
    }

    _tooltipElement.style.removeProperty("--tooltip-shift");
  }

  function _positionInfoTooltipsInRoot(_rootElement)
  {
    if (!_rootElement)
    {
      return;
    }

    var _tooltipButtons = _rootElement.querySelectorAll(".info-icon");
    _tooltipButtons.forEach(function (_buttonElement)
    {
      _positionInfoTooltip(_buttonElement);
    });
  }

  function _buildInfoIcon(_tooltipText)
  {
    if (!_tooltipText)
    {
      return null;
    }

    var _buttonElement = document.createElement("button");
    _buttonElement.type = "button";
    _buttonElement.className = "info-icon";
    _buttonElement.setAttribute("aria-label", _tooltipText);
    _buttonElement.setAttribute("aria-expanded", "false");
    _buttonElement.textContent = "?";

    var _tooltipElement = document.createElement("span");
    _tooltipElement.className = "info-tooltip";
    _tooltipElement.textContent = _tooltipText;
    _buttonElement.appendChild(_tooltipElement);

    _buttonElement.addEventListener("click", function (_event)
    {
      _event.stopPropagation();
      var _openIcons = document.querySelectorAll(".info-icon.is-open");
      _openIcons.forEach(function (_openIcon)
      {
        if (_openIcon !== _buttonElement)
        {
          _openIcon.classList.remove("is-open");
          _openIcon.setAttribute("aria-expanded", "false");
        }
      });

      if (_buttonElement.classList.contains("is-open"))
      {
        _buttonElement.classList.remove("is-open");
        _buttonElement.setAttribute("aria-expanded", "false");
      }
      else
      {
        _buttonElement.classList.add("is-open");
        _buttonElement.setAttribute("aria-expanded", "true");
      }

      _positionInfoTooltip(_buttonElement);
    });

    _buttonElement.addEventListener("mouseenter", function ()
    {
      _positionInfoTooltip(_buttonElement);
    });

    _buttonElement.addEventListener("focus", function ()
    {
      _positionInfoTooltip(_buttonElement);
    });

    _buttonElement.addEventListener("blur", function ()
    {
      _buttonElement.classList.remove("is-open");
      _buttonElement.setAttribute("aria-expanded", "false");
    });

    return _buttonElement;
  }

  function _buildToolSelectorPanel(_userInterfaceElements, _eventHandlers, _configuration)
  {
    var _panelElement = window.CipherCoreDom.createElement("section", "panel tool-selector-panel");
    var _headerElement = window.CipherCoreDom.createElement("div", "panel-header");
    _headerElement.appendChild(window.CipherCoreDom.createElement("div", "panel-title", "Conversion"));
    _panelElement.appendChild(_headerElement);

    var _selectorRowElement = window.CipherCoreDom.createElement("div", "tool-selector-row");
    var _selectElement = document.createElement("select");
    _selectElement.className = "tool-selector-select";
    _selectElement.setAttribute("aria-label", "Conversion tool");

    var _toolIndex = 0;
    for (_toolIndex = 0; _toolIndex < _configuration.tools.length; _toolIndex += 1)
    {
      var _toolDefinition = _configuration.tools[_toolIndex];
      var _optionElement = document.createElement("option");
      _optionElement.value = _toolDefinition.id;
      _optionElement.textContent = _toolDefinition.title;
      _selectElement.appendChild(_optionElement);
    }

    _selectElement.addEventListener("change", function (_event)
    {
      _eventHandlers.onSelectTool(_event.target.value);
    });

    var _swapButtonElement = window.CipherCoreDom.createElement("button", "button button-secondary tool-selector-swap", "Swap");
    _swapButtonElement.type = "button";
    _swapButtonElement.setAttribute("aria-label", "Swap input and output");
    _swapButtonElement.addEventListener("click", function ()
    {
      _eventHandlers.onSwapOutput();
    });

    _selectorRowElement.appendChild(_selectElement);
    _selectorRowElement.appendChild(_swapButtonElement);
    _panelElement.appendChild(_selectorRowElement);

    var _descriptionElement = window.CipherCoreDom.createElement("div", "panel-meta tool-description");
    _panelElement.appendChild(_descriptionElement);

    _userInterfaceElements.toolSelect = _selectElement;
    _userInterfaceElements.toolDescription = _descriptionElement;
    _userInterfaceElements.toolSwapButton = _swapButtonElement;

    return _panelElement;
  }

  function _buildInputPanel(_userInterfaceElements, _eventHandlers, _configuration)
  {
    var _panelElement = window.CipherCoreDom.createElement("section", "panel");
    var _headerElement = window.CipherCoreDom.createElement("div", "panel-header");
    var _titleElement = window.CipherCoreDom.createElement("div", "panel-title", "Input");
    _headerElement.appendChild(_titleElement);
    _panelElement.appendChild(_headerElement);

    var _inputAreaElement = document.createElement("textarea");
    _inputAreaElement.className = "input-area";
    _inputAreaElement.rows = 8;
    _inputAreaElement.placeholder = "Enter input...";
    if (_configuration.app.maxInputChars > 0)
    {
      _inputAreaElement.maxLength = _configuration.app.maxInputChars;
    }
    _panelElement.appendChild(_inputAreaElement);

    var _inputFooterElement = window.CipherCoreDom.createElement("div", "input-meta");
    var _inputHintElement = window.CipherCoreDom.createElement("div", "input-hint");
    var _inputCounterElement = window.CipherCoreDom.createElement("div", "input-counter");
    _inputFooterElement.appendChild(_inputHintElement);
    _inputFooterElement.appendChild(window.CipherCoreDom.createElement("div", "spacer"));
    _inputFooterElement.appendChild(_inputCounterElement);
    _panelElement.appendChild(_inputFooterElement);
    if (_configuration.app.ui.showLiveCount !== true)
    {
      _inputCounterElement.style.display = "none";
    }

    _inputAreaElement.addEventListener("input", function (_event)
    {
      _eventHandlers.onInputChange(_event.target.value);
    });

    _userInterfaceElements.inputTitle = _titleElement;
    _userInterfaceElements.inputArea = _inputAreaElement;
    _userInterfaceElements.inputHint = _inputHintElement;
    _userInterfaceElements.inputCounter = _inputCounterElement;

    return _panelElement;
  }

  function _buildParameterPanel(_userInterfaceElements)
  {
    var _panelElement = window.CipherCoreDom.createElement("section", "panel");
    var _headerElement = window.CipherCoreDom.createElement("div", "panel-header");
    var _titleElement = window.CipherCoreDom.createElement("div", "panel-title", "Parameters");
    _headerElement.appendChild(_titleElement);
    _panelElement.appendChild(_headerElement);

    var _parameterGridElement = window.CipherCoreDom.createElement("div", "parameter-grid");
    _panelElement.appendChild(_parameterGridElement);

    _userInterfaceElements.paramGrid = _parameterGridElement;

    return _panelElement;
  }

  function _buildOutputPanel(_userInterfaceElements, _eventHandlers, _configuration)
  {
    var _panelElement = window.CipherCoreDom.createElement("section", "panel");
    var _headerElement = window.CipherCoreDom.createElement("div", "panel-header");
    var _titleElement = window.CipherCoreDom.createElement("div", "panel-title", "Output");
    var _actionsElement = window.CipherCoreDom.createElement("div", "output-actions");
    var _swapButtonElement = window.CipherCoreDom.createElement("button", "button button-secondary", "Swap");
    _swapButtonElement.type = "button";
    var _copyButtonElement = window.CipherCoreDom.createElement("button", "button", "Copy");
    _copyButtonElement.type = "button";
    _actionsElement.appendChild(_swapButtonElement);
    _actionsElement.appendChild(_copyButtonElement);
    _headerElement.appendChild(_titleElement);
    _headerElement.appendChild(_actionsElement);
    _panelElement.appendChild(_headerElement);

    var _errorListElement = window.CipherCoreDom.createElement("div", "error-list");
    _panelElement.appendChild(_errorListElement);

    var _outputAreaElement = document.createElement("textarea");
    _outputAreaElement.className = "output-area";
    _outputAreaElement.rows = 8;
    _outputAreaElement.readOnly = true;
    if (_configuration.app.ui.preferMonospaceOutput === true)
    {
      _outputAreaElement.classList.add("is-monospace");
    }
    _panelElement.appendChild(_outputAreaElement);

    _swapButtonElement.addEventListener("click", function ()
    {
      _eventHandlers.onSwapOutput();
    });

    _copyButtonElement.addEventListener("click", function ()
    {
      _eventHandlers.onCopyOutput();
    });

    _userInterfaceElements.outputTitle = _titleElement;
    _userInterfaceElements.outputArea = _outputAreaElement;
    _userInterfaceElements.errorList = _errorListElement;
    _userInterfaceElements.copyButton = _copyButtonElement;
    _userInterfaceElements.swapButton = _swapButtonElement;

    return _panelElement;
  }

  function _buildFooter(_configuration)
  {
    var _footerElement = window.CipherCoreDom.createElement("div", "app-footer");
    var _footerText = _configuration.app.appName + " " + _configuration.app.version;
    _footerElement.textContent = _footerText;
    return _footerElement;
  }

  function _buildParameterInputIdentifier(_toolIdentifier, _parameterIdentifier)
  {
    var _sanitizedToolIdentifier = String(_toolIdentifier).replace(/[^a-zA-Z0-9_-]/g, "-");
    var _sanitizedParameterIdentifier = String(_parameterIdentifier).replace(/[^a-zA-Z0-9_-]/g, "-");
    return "parameter-" + _sanitizedToolIdentifier + "-" + _sanitizedParameterIdentifier;
  }

  function _renderParameters(_userInterfaceElements, _toolDefinition, _parameterValues, _configuration, _eventHandlers)
  {
    window.CipherCoreDom.clearChildren(_userInterfaceElements.paramGrid);

    if (!_toolDefinition.parameters || _toolDefinition.parameters.length === 0)
    {
      _userInterfaceElements.paramGrid.appendChild(window.CipherCoreDom.createElement("div", "empty-state", "No parameters for this tool."));
      return;
    }

    _toolDefinition.parameters.forEach(function (_parameterDefinition)
    {
      var _controlWrapperElement = window.CipherCoreDom.createElement("div", "parameter-control");
      var _labelElement = document.createElement("label");
      _labelElement.textContent = _parameterDefinition.label;
      var _helpIconElement = _buildInfoIcon(_parameterDefinition.help);
      var _inputIdentifier = _buildParameterInputIdentifier(_toolDefinition.id, _parameterDefinition.id);

      if (_parameterDefinition.type === "boolean")
      {
        var _checkboxWrapperElement = window.CipherCoreDom.createElement("div", "parameter-checkbox");
        var _checkboxElement = document.createElement("input");
        _checkboxElement.type = "checkbox";
        _checkboxElement.id = _inputIdentifier;
        _checkboxElement.checked = _parameterValues[_parameterDefinition.id] === true;
        _labelElement.htmlFor = _inputIdentifier;
        _checkboxWrapperElement.appendChild(_checkboxElement);
        _checkboxWrapperElement.appendChild(_labelElement);
        if (_helpIconElement)
        {
          _checkboxWrapperElement.appendChild(_helpIconElement);
        }
        _controlWrapperElement.appendChild(_checkboxWrapperElement);

        _checkboxElement.addEventListener("change", function (_event)
        {
          _eventHandlers.onParamChange(_toolDefinition.id, _parameterDefinition, _event.currentTarget.checked);
        });
      }
      else if (_parameterDefinition.type === "select")
      {
        var _labelRowElement = window.CipherCoreDom.createElement("div", "parameter-label-row");
        var _selectElement = document.createElement("select");
        _labelElement.htmlFor = _inputIdentifier;
        _selectElement.id = _inputIdentifier;
        _labelRowElement.appendChild(_labelElement);
        if (_helpIconElement)
        {
          _labelRowElement.appendChild(_helpIconElement);
        }

        var _optionIndex = 0;
        for (_optionIndex = 0; _optionIndex < _parameterDefinition.options.length; _optionIndex += 1)
        {
          var _optionValue = _parameterDefinition.options[_optionIndex];
          var _optionElement = document.createElement("option");
          _optionElement.value = String(_optionValue);
          _optionElement.textContent = _formatOptionLabel(_parameterDefinition, _optionValue, _configuration);
          _selectElement.appendChild(_optionElement);
        }
        _selectElement.value = String(_parameterValues[_parameterDefinition.id]);

        _selectElement.addEventListener("change", function (_event)
        {
          _eventHandlers.onParamChange(_toolDefinition.id, _parameterDefinition, _event.target.value);
        });

        _controlWrapperElement.appendChild(_labelRowElement);
        _controlWrapperElement.appendChild(_selectElement);
      }
      else if (_parameterDefinition.type === "integer")
      {
        var _numberLabelRowElement = window.CipherCoreDom.createElement("div", "parameter-label-row");
        var _numberInputElement = document.createElement("input");
        _numberInputElement.type = "number";
        _numberInputElement.id = _inputIdentifier;
        _labelElement.htmlFor = _inputIdentifier;
        if (typeof _parameterDefinition.min === "number")
        {
          _numberInputElement.min = _parameterDefinition.min;
        }
        if (typeof _parameterDefinition.max === "number")
        {
          _numberInputElement.max = _parameterDefinition.max;
        }
        _numberInputElement.value = _parameterValues[_parameterDefinition.id];

        _numberInputElement.addEventListener("input", function (_event)
        {
          _eventHandlers.onParamChange(_toolDefinition.id, _parameterDefinition, _event.target.value);
        });

        _numberLabelRowElement.appendChild(_labelElement);
        if (_helpIconElement)
        {
          _numberLabelRowElement.appendChild(_helpIconElement);
        }

        _controlWrapperElement.appendChild(_numberLabelRowElement);
        _controlWrapperElement.appendChild(_numberInputElement);
      }
      else
      {
        var _textLabelRowElement = window.CipherCoreDom.createElement("div", "parameter-label-row");
        var _textInputElement = document.createElement("input");
        _textInputElement.type = "text";
        _textInputElement.id = _inputIdentifier;
        _labelElement.htmlFor = _inputIdentifier;
        _textInputElement.value = _parameterValues[_parameterDefinition.id];

        _textInputElement.addEventListener("input", function (_event)
        {
          _eventHandlers.onParamChange(_toolDefinition.id, _parameterDefinition, _event.target.value);
        });

        _textLabelRowElement.appendChild(_labelElement);
        if (_helpIconElement)
        {
          _textLabelRowElement.appendChild(_helpIconElement);
        }

        _controlWrapperElement.appendChild(_textLabelRowElement);
        _controlWrapperElement.appendChild(_textInputElement);
      }

      _userInterfaceElements.paramGrid.appendChild(_controlWrapperElement);
    });

    _positionInfoTooltipsInRoot(_userInterfaceElements.paramGrid);
  }

  function _updateToolDetails(_userInterfaceElements, _toolDefinition, _configuration, _state, _eventHandlers)
  {
    _userInterfaceElements.inputTitle.textContent = _toolDefinition.input.label || "Input";
    _userInterfaceElements.outputTitle.textContent = _toolDefinition.output.label || "Output";
    _userInterfaceElements.toolDescription.textContent = _toolDefinition.description || "";
    _userInterfaceElements.toolSelect.value = _toolDefinition.id;
    if (_userInterfaceElements.inputArea)
    {
      _userInterfaceElements.inputArea.placeholder = "Enter " + _userInterfaceElements.inputTitle.textContent.toLowerCase() + "...";
    }
    _renderParameters(_userInterfaceElements, _toolDefinition, _state.parametersByToolIdentifier[_toolDefinition.id], _configuration, _eventHandlers);
  }

  function _updateOutput(_userInterfaceElements, _state)
  {
    _userInterfaceElements.outputArea.value = _state.outputText || "";
  }

  function _updateErrors(_userInterfaceElements, _state)
  {
    var _combinedMessages = [];
    var _messageIndex = 0;

    for (_messageIndex = 0; _messageIndex < _state.validationMessages.length; _messageIndex += 1)
    {
      _combinedMessages.push(_state.validationMessages[_messageIndex]);
    }

    for (_messageIndex = 0; _messageIndex < _state.conversionMessages.length; _messageIndex += 1)
    {
      _combinedMessages.push(_state.conversionMessages[_messageIndex]);
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
    var _maximumInputCharacters = _configuration.app.maxInputChars || 0;
    var _characterCount = window.CipherCoreValidate.countCharacters ? window.CipherCoreValidate.countCharacters(_state.inputText) : _state.inputText.length;
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

  function _init(_rootElement, _configuration, _state, _eventHandlers)
  {
    window.CipherCoreDom.clearChildren(_rootElement);

    var _userInterfaceElements = {};
    var _workspaceElement = window.CipherCoreDom.createElement("div", "workspace");

    _workspaceElement.appendChild(_buildToolSelectorPanel(_userInterfaceElements, _eventHandlers, _configuration));
    _workspaceElement.appendChild(_buildInputPanel(_userInterfaceElements, _eventHandlers, _configuration));
    _workspaceElement.appendChild(_buildParameterPanel(_userInterfaceElements));
    _workspaceElement.appendChild(_buildOutputPanel(_userInterfaceElements, _eventHandlers, _configuration));

    _rootElement.appendChild(_workspaceElement);
    _rootElement.appendChild(_buildFooter(_configuration));

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

    var _toolDefinition = window.CipherAppState.getToolByIdentifier(_configuration.tools, _state.selectedToolIdentifier) || _configuration.tools[0];
    _updateToolDetails(_userInterfaceElements, _toolDefinition, _configuration, _state, _eventHandlers);
    _updateOutput(_userInterfaceElements, _state);
    _updateErrors(_userInterfaceElements, _state);
    _updateInputCounter(_userInterfaceElements, _state, _configuration);
    _setCopyStatus(_userInterfaceElements, _state.ui.copyStatus);

    return {
      elements: _userInterfaceElements,
      renderToolDetails: function (_nextState)
      {
        var _nextToolDefinition = window.CipherAppState.getToolByIdentifier(_configuration.tools, _nextState.selectedToolIdentifier) || _configuration.tools[0];
        _updateToolDetails(_userInterfaceElements, _nextToolDefinition, _configuration, _nextState, _eventHandlers);
      },
      updateOutput: function (_nextState)
      {
        _updateOutput(_userInterfaceElements, _nextState);
      },
      updateErrors: function (_nextState)
      {
        _updateErrors(_userInterfaceElements, _nextState);
      },
      updateInputCounter: function (_nextState)
      {
        _updateInputCounter(_userInterfaceElements, _nextState, _configuration);
      },
      setCopyStatus: function (_status)
      {
        _setCopyStatus(_userInterfaceElements, _status);
      },
      setMobileLayout: function (_isMobile)
      {
        _setMobileLayout(_rootElement, _isMobile);
        _positionInfoTooltipsInRoot(_rootElement);
      },
      setInputValue: function (_value)
      {
        _userInterfaceElements.inputArea.value = _value;
      }
    };
  }

  window.CipherAppRender = {
    init: _init
  };
}());

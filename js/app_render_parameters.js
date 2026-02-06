(function ()
{
  "use strict";

  function _buildParameterInputIdentifier(_toolIdentifier, _parameterIdentifier)
  {
    var _sanitizedToolIdentifier = String(_toolIdentifier).replace(/[^a-zA-Z0-9_-]/g, "-");
    var _sanitizedParameterIdentifier = String(_parameterIdentifier).replace(/[^a-zA-Z0-9_-]/g, "-");
    return "parameter-" + _sanitizedToolIdentifier + "-" + _sanitizedParameterIdentifier;
  }

  function _renderParameters(_userInterfaceElements, _toolDefinition, _parameterValues, _configuration, _eventHandlers)
  {
    window.CipherCoreDom.clearChildren(_userInterfaceElements.paramGrid);

    if (!_toolDefinition || !_toolDefinition.parameters || _toolDefinition.parameters.length === 0)
    {
      _userInterfaceElements.paramGrid.appendChild(window.CipherCoreDom.createElement("div", "empty-state", "No parameters for this tool."));
      return;
    }

    var _resolvedParameterValues = _parameterValues || {};

    _toolDefinition.parameters.forEach(function (_parameterDefinition)
    {
      var _controlWrapperElement = window.CipherCoreDom.createElement("div", "parameter-control");
      var _labelElement = document.createElement("label");
      _labelElement.textContent = _parameterDefinition.label;
      var _helpIconElement = window.CipherAppRenderTooltips.buildInfoIcon(_parameterDefinition.help);
      var _inputIdentifier = _buildParameterInputIdentifier(_toolDefinition.id, _parameterDefinition.id);

      if (_parameterDefinition.type === "boolean")
      {
        var _checkboxWrapperElement = window.CipherCoreDom.createElement("div", "parameter-checkbox");
        var _checkboxElement = document.createElement("input");
        _checkboxElement.type = "checkbox";
        _checkboxElement.id = _inputIdentifier;
        _checkboxElement.checked = _resolvedParameterValues[_parameterDefinition.id] === true;
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
          _optionElement.textContent = window.CipherAppRenderTooltips.formatOptionLabel(_parameterDefinition, _optionValue, _configuration);
          _selectElement.appendChild(_optionElement);
        }
        _selectElement.value = String(_resolvedParameterValues[_parameterDefinition.id]);

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
        _numberInputElement.value = _resolvedParameterValues[_parameterDefinition.id];

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
        _textInputElement.value = _resolvedParameterValues[_parameterDefinition.id];

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

    window.CipherAppRenderTooltips.positionInfoTooltipsInRoot(_userInterfaceElements.paramGrid);
  }

  window.CipherAppRenderParameters = {
    buildParameterInputIdentifier: _buildParameterInputIdentifier,
    renderParameters: _renderParameters
  };
}());

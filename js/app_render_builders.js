(function ()
{
  "use strict";

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

    var _toolList = _configuration && _configuration.tools ? _configuration.tools : [];
    var _toolIndex = 0;
    for (_toolIndex = 0; _toolIndex < _toolList.length; _toolIndex += 1)
    {
      var _toolDefinition = _toolList[_toolIndex];
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
    _panelElement.appendChild(_inputAreaElement);

    var _inputFooterElement = window.CipherCoreDom.createElement("div", "input-meta");
    var _inputHintElement = window.CipherCoreDom.createElement("div", "input-hint");
    var _inputCounterElement = window.CipherCoreDom.createElement("div", "input-counter");
    _inputFooterElement.appendChild(_inputHintElement);
    _inputFooterElement.appendChild(window.CipherCoreDom.createElement("div", "spacer"));
    _inputFooterElement.appendChild(_inputCounterElement);
    _panelElement.appendChild(_inputFooterElement);

    var _appConfiguration = _configuration && _configuration.app ? _configuration.app : {};
    var _uiConfiguration = _appConfiguration.ui || {};
    if (_uiConfiguration.showLiveCount !== true)
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

    var _appConfiguration = _configuration && _configuration.app ? _configuration.app : {};
    var _uiConfiguration = _appConfiguration.ui || {};
    if (_uiConfiguration.preferMonospaceOutput === true)
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

  window.CipherAppRenderBuilders = {
    buildToolSelectorPanel: _buildToolSelectorPanel,
    buildInputPanel: _buildInputPanel,
    buildParameterPanel: _buildParameterPanel,
    buildOutputPanel: _buildOutputPanel
  };
}());

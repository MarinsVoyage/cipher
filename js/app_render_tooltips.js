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

  window.CipherAppRenderTooltips = {
    formatOptionLabel: _formatOptionLabel,
    positionInfoTooltipsInRoot: _positionInfoTooltipsInRoot,
    buildInfoIcon: _buildInfoIcon
  };
}());

(function ()
{
  "use strict";

  function _getToolByIdentifier(_toolList, _toolIdentifier)
  {
    if (!Array.isArray(_toolList))
    {
      return null;
    }

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
    if (!_parameterDefinition)
    {
      return _rawValue;
    }

    if (_parameterDefinition.type === "boolean")
    {
      return _rawValue === true || _rawValue === "true";
    }

    if (_parameterDefinition.type === "select")
    {
      var _optionList = _parameterDefinition.options || [];
      var _optionIndex = 0;
      for (_optionIndex = 0; _optionIndex < _optionList.length; _optionIndex += 1)
      {
        if (String(_optionList[_optionIndex]) === String(_rawValue))
        {
          return _optionList[_optionIndex];
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
    var _parameterList = _toolDefinition && _toolDefinition.parameters ? _toolDefinition.parameters : [];
    for (_parameterIndex = 0; _parameterIndex < _parameterList.length; _parameterIndex += 1)
    {
      _defaultParameters[_parameterList[_parameterIndex].id] = _parameterList[_parameterIndex].default;
    }
    return _defaultParameters;
  }

  function _mergeParameters(_toolDefinition, _storedParameters)
  {
    var _mergedParameters = _buildDefaultParameters(_toolDefinition);
    var _parameterIndex = 0;
    var _parameterList = _toolDefinition && _toolDefinition.parameters ? _toolDefinition.parameters : [];
    for (_parameterIndex = 0; _parameterIndex < _parameterList.length; _parameterIndex += 1)
    {
      var _parameterDefinition = _parameterList[_parameterIndex];
      if (_storedParameters && _storedParameters[_parameterDefinition.id] !== undefined)
      {
        _mergedParameters[_parameterDefinition.id] = _normalizeParameterValue(_parameterDefinition, _storedParameters[_parameterDefinition.id]);
      }
    }
    return _mergedParameters;
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

  window.CipherAppStateParameters = {
    getToolByIdentifier: _getToolByIdentifier,
    normalizeParameterValue: _normalizeParameterValue,
    buildParametersByToolIdentifier: _buildParametersByToolIdentifier
  };
}());

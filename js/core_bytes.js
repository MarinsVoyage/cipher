(function ()
{
  "use strict";

  window.CipherCoreBytes = {
    parseHexadecimalToBytes: window.CipherCoreBytesParsers.parseHexadecimalToBytes,
    parseBinaryToBytes: window.CipherCoreBytesParsers.parseBinaryToBytes,
    bytesToHexadecimal: window.CipherCoreBytesFormatters.bytesToHexadecimal,
    bytesToBinary: window.CipherCoreBytesFormatters.bytesToBinary
  };
}());

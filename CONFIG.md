# Configuration

This app loads configuration from JSON files under `config/` and from `config_manifest.json`.

## Files

- `config/app.json`: App name, version, input limits, storage keys, and UI defaults.
- `config/encodings.json`: Supported encodings. CP037 uses a full 256-byte mapping.
- `config/tools.json`: Tool registry, parameters, defaults, optional `reverseToolIdentifier` for swap behavior, and optional parameter `help` text for tooltips.
- `config_manifest.json`: Lists the config file paths to fetch when served over HTTP.

## Adding A Tool

1. Add a new tool entry to `config/tools.json` with a unique `id` and parameter definitions.
2. Implement the tool handler in `js/app_tools_convert.js` (only the conversions in scope are supported).
3. If the tool needs new parameters, the UI will render them automatically from `config/tools.json`.

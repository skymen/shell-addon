const fs = require("fs");
const path = require("path");

function removeFilesRecursively(dir) {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach(function (file) {
      var curPath = path.join(dir, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        removeFilesRecursively(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dir);
  }
}

function getFileListFromConfig(files) {
  return files;
}

function addonFromConfig(config) {
  return {
    "is-c3-addon": true,
    type: config.addonType,
    name: config.name,
    id: config.id,
    version: config.version,
    author: config.author,
    website: config.website,
    documentation: config.documentation,
    description: config.description,
    "editor-scripts": ["editor.js"],
    "file-list": [
      "c3runtime/actions.js",
      "c3runtime/conditions.js",
      "c3runtime/expressions.js",
      "c3runtime/instance.js",
      "c3runtime/plugin.js",
      "c3runtime/type.js",
      "lang/en-US.json",
      "aces.json",
      "addon.json",
      "icon.svg",
      "editor.js",
      ...getFileListFromConfig(config.additionalFiles || []),
    ],
  };
}

function langFromConfig(config) {
  const lang = {
    languageTag: "en-US",
    fileDescription: "Strings for skymen_shell.",
    text: {},
  };

  let root;

  if (config.addonType === "plugin") {
    lang.text.plugins[config.name] = {};
    root = lang.text.plugins[config.name];
  } else if (config.addonType === "behavior") {
    lang.text.behaviors[config.name] = {};
    root = lang.text.behaviors[config.name];
  } else if (config.addonType === "effect") {
    lang.text.effects[config.name] = {};
    root = lang.text.effects[config.name];
  } else {
    throw new Error("Invalid addon type");
  }
  root.name = config.name;
  root.description = config.description;
  root["help-url"] = config.documentation;
  root.aceCategories = config.aceCategories;
  root.properties = {};
  config.properties.forEach((property) => {
    root.properties[property.id] = {
      name: property.name,
      desc: property.desc,
    };
    if (property.type === "combo") {
      root.properties[property.id].items = {};
      property.items.forEach((item) => {
        const key = Object.keys(item)[0];
        root.properties[key].items[key] = item[key];
      });
    } else if (property.type === "link") {
      root.properties[property.id]["link-text"] = property.linkText;
    }
  });

  root.actions = {};
  Object.keys(config.Acts).forEach((key) => {
    const action = config.Acts[key];
    root.actions[key] = {
      "list-name": action.listName,
      "display-text": action.displayText,
      description: action.description,
      params: {},
    };

    action.params.forEach((param) => {
      root.actions[key].params[param.id] = {
        name: param.name,
        desc: param.desc,
      };
      if (param.type === "combo") {
        root.actions[key].params[param.id].items = {};
        param.items.forEach((item) => {
          const key = Object.keys(item)[0];
          root.actions[key].params[param.id].items[key] = item[key];
        });
      }
    });
  });

  root.conditions = {};
  Object.keys(config.Cnds).forEach((key) => {
    const condition = config.Cnds[key];
    root.conditions[key] = {
      "list-name": condition.listName,
      "display-text": condition.displayText,
      description: condition.description,
      params: {},
    };

    condition.params.forEach((param) => {
      root.conditions[key].params[param.id] = {
        name: param.name,
        desc: param.desc,
      };
      if (param.type === "combo") {
        root.conditions[key].params[param.id].items = {};
        param.items.forEach((item) => {
          const key = Object.keys(item)[0];
          root.conditions[key].params[param.id].items[key] = item[key];
        });
      }
    });
  });

  root.expressions = {};
  Object.keys(config.Exps).forEach((key) => {
    const expression = config.Exps[key];
    root.expressions[key] = {
      "translated-name": key,
      description: expression.description,
      params: {},
    };

    expression.params.forEach((param) => {
      root.expressions[key].params[param.id] = {
        name: param.name,
        desc: param.desc,
      };
      if (param.type === "combo") {
        root.expressions[key].params[param.id].items = {};
        param.items.forEach((item) => {
          const key = Object.keys(item)[0];
          root.expressions[key].params[param.id].items[key] = item[key];
        });
      }
    });
  });

  return lang;
}

function acesFromConfig(config) {
  const aces = {};

  Object.keys(config.aceCategories).forEach((category) => {
    aces[category] = {
      conditions: Object.keys(config.Cnds)
        .filter((key) => config.Cnds[key].aceCategory === category)
        .map((key) => {
          const ace = config.Cnds[key];
          const ret = {
            id: key,
            sciptName: key,
          };
          Object.keys(ace).forEach((key) => {
            switch (key) {
              case "category":
              case "forward":
              case "handler":
              case "autoScriptInterface":
              case "listName":
              case "displayText":
              case "description":
              case "params":
                break;
              default:
                ret[key] = ace[key];
            }
          });
          if (ace.params) {
            ret.params = ace.params.map((param) => {
              const ret = {};
              Object.keys(param).forEach((key) => {
                switch (key) {
                  case "name":
                  case "desc":
                  case "items":
                    break;
                  default:
                    ret[key] = param[key];
                }
              });
              if (param.items) {
                ret.items = param.items.map((item) => Object.keys(item)[0]);
              }

              return ret;
            });
          }
          return ret;
        }),
      actions: Object.keys(config.Cnds)
        .filter((key) => config.Cnds[key].aceCategory === category)
        .map((key) => {
          const ace = config.Cnds[key];
          const ret = {
            id: key,
            sciptName: key,
          };
          Object.keys(ace).forEach((key) => {
            switch (key) {
              case "category":
              case "forward":
              case "handler":
              case "autoScriptInterface":
              case "listName":
              case "displayText":
              case "description":
              case "params":
                break;
              default:
                ret[key] = ace[key];
            }
          });
          if (ace.params) {
            ret.params = ace.params.map((param) => {
              const ret = {};
              Object.keys(param).forEach((key) => {
                switch (key) {
                  case "name":
                  case "desc":
                  case "items":
                    break;
                  default:
                    ret[key] = param[key];
                }
              });
              if (param.items) {
                ret.items = param.items.map((item) => Object.keys(item)[0]);
              }

              return ret;
            });
          }
          return ret;
        }),
      expressions: Object.keys(config.Cnds)
        .filter((key) => config.Cnds[key].aceCategory === category)
        .map((key) => {
          const ace = config.Cnds[key];
          const ret = {
            id: key,
            sciptName: key,
            expressionName: key,
          };
          Object.keys(ace).forEach((key) => {
            switch (key) {
              case "category":
              case "forward":
              case "handler":
              case "autoScriptInterface":
              case "listName":
              case "displayText":
              case "description":
              case "params":
                break;
              default:
                ret[key] = ace[key];
            }
          });
          if (ace.params) {
            ret.params = ace.params.map((param) => {
              const ret = {};
              Object.keys(param).forEach((key) => {
                switch (key) {
                  case "name":
                  case "desc":
                  case "items":
                    break;
                  default:
                    ret[key] = param[key];
                }
              });
              if (param.items) {
                ret.items = param.items.map((item) => Object.keys(item)[0]);
              }

              return ret;
            });
          }
          return ret;
        }),
    };
  });
}

removeFilesRecursively("./export");

// create lang and c3runtime folders
fs.mkdirSync("./export/lang");
fs.mkdirSync("./export/c3runtime");

// create empty file called actions.js in c3runtime folder
const emptyFiles = [
  "actions.js",
  "conditions.js",
  "expressions.js",
  "instance.js",
  "type.js",
];
emptyFiles.forEach((file) => {
  fs.closeSync(fs.openSync(`./export/c3runtime/${file}`, "w"));
});

// import config from config.js
const config = require("./src/pluginConfig.js");

const addonJson = addonFromConfig(config);

// write addon.json
fs.writeFileSync("./export/addon.json", JSON.stringify(addonJson, null, 2));

const lang = langFromConfig(config);

// write lang/en-US.json
fs.writeFileSync("./export/lang/en-US.json", JSON.stringify(lang, null, 2));

const aces = acesFromConfig(config);

// write aces.json
fs.writeFileSync("./export/aces.json", JSON.stringify(aces, null, 2));

// copy icon.svg
fs.copyFileSync("./src/icon.svg", "./export/icon.svg");

function getEditorPluginInfoFromConfig(config) {
  const editorPluginInfo = {
    id: config.id,
    version: config.version,
    category: config.category,
    author: config.author,
    type: config.type,
    addonType: config.addonType,
    info: config.info,
    properties: config.properties,
  };
  return "const PLUGIN_INFO = " + JSON.stringify(editorPluginInfo, null, 2);
}

// write editor.js and replace "//<-- PLUGIN_INFO -->" with the plugin info
const editor = fs.readFileSync("./src/editor.js", "utf8");
const editorPluginInfo = getEditorPluginInfoFromConfig(config);
const editorWithPluginInfo = editor.replaceAll(
  "//<-- PLUGIN_INFO -->",
  editorPluginInfo
);
fs.writeFileSync("./export/editor.js", editorWithPluginInfo);

function getRuntimePluginInfoFromConfig(config) {
  return `const PLUGIN_INFO = {
  id: "${config.id}",
  Acts: {
    ${Object.keys(config.Acts)
      .map((key) => {
        return `"${key}": {
          ${
            config.Acts[key].hasOwnProperty("forward")
              ? `"forward": "(inst) => inst.${config.Acts[key][key]}",`
              : ""
          }
          ${
            config.Acts[key].hasOwnProperty("handler")
              ? `"handler": ${config.Acts[key][key]},`
              : ""
          }
          ${
            config.Acts[key].hasOwnProperty("autoScriptInterface")
              ? `"autoScriptInterface": ${config.Acts[key].autoScriptInterface},`
              : ""
          }
          `;
      })
      .join(",\n")}
  },
  Cnds: {
    ${Object.keys(config.Cnds)
      .map((key) => {
        return `"${key}": {
        ${
          config.Cnds[key].hasOwnProperty("forward")
            ? `"forward": "(inst) => inst.${config.Cnds[key][key]}",`
            : ""
        }
        ${
          config.Cnds[key].hasOwnProperty("handler")
            ? `"handler": ${config.Cnds[key][key]},`
            : ""
        }
        ${
          config.Cnds[key].hasOwnProperty("autoScriptInterface")
            ? `"autoScriptInterface": ${config.Cnds[key].autoScriptInterface},`
            : ""
        }
        `;
      })
      .join(",\n")}
  },
  Exps: {
    ${Object.keys(config.Exps)
      .map((key) => {
        return `"${key}": {
        ${
          config.Exps[key].hasOwnProperty("forward")
            ? `"forward": "(inst) => inst.${config.Exps[key][key]}",`
            : ""
        }
        ${
          config.Exps[key].hasOwnProperty("handler")
            ? `"handler": ${config.Exps[key][key]},`
            : ""
        }
        ${
          config.Exps[key].hasOwnProperty("autoScriptInterface")
            ? `"autoScriptInterface": ${config.Exps[key].autoScriptInterface},`
            : ""
        }
        `;
      })
      .join(",\n")}
  },
};`;
}

// write plugin.js and replace "//<-- PLUGIN_INFO -->" with the plugin info
const plugin = fs.readFileSync("./src/plugin.js", "utf8");
const pluginPluginInfo = getRuntimePluginInfoFromConfig(config);
const pluginWithPluginInfo = plugin.replaceAll(
  "//<-- PLUGIN_INFO -->",
  pluginPluginInfo
);
fs.writeFileSync("./export/c3runtime/plugin.js", pluginWithPluginInfo);

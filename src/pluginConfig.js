import InfoConfig from "./infoConfig.js";

export const config = {
  addonType: "plugin",
  id: "skymen_Shell",
  name: "Empty Shell",
  version: "1.0.0.0",
  category: "general",
  author: "skymen",
  website: "https://www.construct.net",
  documentation: "https://www.construct.net",
  type: "world",
  additionalFiles: [],
  info: InfoConfig,
  properties: [
    {
      type: "float",
      id: "hotspot-x",
      value: 0.5,
      options: {
        interpolatable: false,
      },
      name: "Origin X",
      desc: "X Coordinate (0-1)",
    },
    {
      type: "float",
      id: "hotspot-y",
      value: 0.5,
      options: {
        interpolatable: false,
      },
      name: "Origin Y",
      desc: "Y Coordinate (0-1)",
    },
  ],
  aceCategories: {
    general: "General",
  },
  Acts: {
    SetSource: {
      category: "general",
      forward: "_SetSource",
      autoScriptInterface: false,
      highlight: true,
      listName: "Set Source",
      displayText:
        "Set the source to [i]{0}[/i] (keep sync: [i]{1}[/i], sync size: [i]{2}[/i], fallback: [i]{3}[/i], sync origin: [i]{4}[/i])",
      description: "Set the source object",
      params: [
        {
          id: "source",
          type: "object",
          allowedPluginIds: ["Sprite"],
          name: "Source",
          desc: "The source object",
        },
        {
          id: "keep-sync",
          type: "boolean",
          name: "Keep Sync",
          desc: "Keep the object synced to the source",
        },
        {
          id: "sync-size",
          type: "combo",
          items: [
            { "no-sync": "No Sync" },
            { "sprite-size": "Sync with Sprite Size" },
            { "image-size": "Sync with Image Size" },
          ],
          name: "Sync Size",
          desc: "How to sync the size",
        },
        {
          id: "fallback",
          type: "combo",
          items: ["item1", "item2", "item3", "item4"],
          name: "Fallback",
          desc: "If keeping sync, what to do if source is destroyed",
          items: [
            { item1: "Destroy with source" },
            { item2: "Fallback on another instance or destroy" },
            { item3: "Fallback on another instance or reset" },
            { item4: "Reset image" },
          ],
        },
        {
          id: "sync-origin",
          type: "boolean",
          name: "Sync Origin",
          desc: "Wether to sync the origin",
        },
      ],
    },
    SetHotspot: {
      category: "general",
      forward: "_SetHotspot",
      autoScriptInterface: true,
      highlight: true,
      params: [
        {
          id: "hotspot-x",
          name: "Hotspot X",
          desc: "The hotspot y coordinate (0-1)",
          type: "number",
          value: 0,
        },
        {
          id: "hotspot-y",
          name: "Hotspot Y",
          desc: "The hotspot x coordinate (0-1)",
          type: "number",
          value: 0,
        },
      ],
      listName: "Set Hotspot",
      displayText: "Set the hotspot to [i]{0}[/i], [i]{1}[/i]",
      description: "Set the hotspot",
    },
  },
  Cnds: {
    HasSource: {
      category: "general",
      handler: `function() {
        return !!(this.source || this.sourceTex);
      }`,
      autoScriptInterface: true,
      highlight: false,
      params: [],
      listName: "Has source",
      displayText: "Has source",
      description: "Test if the object has a source object",
    },
    KeepsSync: {
      category: "general",
      handler: `function () {
        return !!(this.source || this.sourceTex) && this.keepSync;
      }`,
      autoScriptInterface: true,
      highlight: false,
      params: [],
      listName: "Keeps sync",
      displayText: "Keeps sync",
      description: "Test if the object keeps sync with the source object",
    },
  },
  Exps: {
    HotspotX: {
      category: "general",
      handler: `function() {
        return this.hotspotX;
      }`,
      autoScriptInterface: true,
      highlight: false,
      returnType: "number",
      description: "Get the hotspot x coordinate",
      params: [],
    },
    HotspotY: {
      category: "general",
      handler: `function() {
        return this.hotspotY;
      }`,
      autoScriptInterface: true,
      highlight: false,
      returnType: "number",
      description: "Get the hotspot y coordinate",
      params: [],
    },
  },
};

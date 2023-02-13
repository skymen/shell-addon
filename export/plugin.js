const SDK = self.SDK;

const PLUGIN_ID = "MyCompany_DrawingPlugin";

const PLUGIN_VERSION = "1.0.0.0";
const PLUGIN_CATEGORY = "general";

let app = null;

const PLUGIN_CLASS =
  (SDK.Plugins.MyCompany_DrawingPlugin = class MyDrawingPlugin extends (
    SDK.IPluginBase
  ) {
    constructor() {
      super(PLUGIN_ID);

      SDK.Lang.PushContext("plugins." + PLUGIN_ID.toLowerCase());

      this._info.SetName(self.lang(".name"));
      this._info.SetDescription(self.lang(".description"));
      this._info.SetVersion(PLUGIN_VERSION);
      this._info.SetCategory(PLUGIN_CATEGORY);
      this._info.SetAuthor("Scirra");
      this._info.SetHelpUrl(self.lang(".help-url"));
      this._info.SetPluginType("world"); // mark as world plugin, which can draw
      this._info.SetIsResizable(true); // allow to be resized
      this._info.SetIsRotatable(true); // allow to be rotated
      this._info.SetHasImage(true);
      this._info.SetSupportsEffects(true); // allow effects
      this._info.SetMustPreDraw(true);

      SDK.Lang.PushContext(".properties");

      this._info.SetProperties([
        new SDK.PluginProperty("link", "edit-image", {
          linkCallback: function (sdkType) {
            sdkType.GetObjectType().EditImage();
          },
          callbackType: "once-for-type",
        }),
        new SDK.PluginProperty("link", "make-original-size", {
          linkCallback: function (sdkInst) {
            sdkInst.OnMakeOriginalSize();
          },
          callbackType: "for-each-instance",
        }),
        new SDK.PluginProperty("integer", "test-property", 0),
      ]);

      SDK.Lang.PopContext(); // .properties

      SDK.Lang.PopContext();
    }
  });

PLUGIN_CLASS.Register(PLUGIN_ID, PLUGIN_CLASS);

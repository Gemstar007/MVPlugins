//=============================================================================
// MEE_RunCommonEventOnLoad.js                                                             
//=============================================================================


/*:
*
* @author Plugin Jeremy Meese
* @plugindesc Add this plugin to run a common event on map load.
*
* @param CommonEventNumber
* @desc Common Event to Run
* @default 6
*
* @param DontRunNoteTag
* @desc Notetag applied to maps this should not be run on.  [A-Za-z] ONLY.  Example notetag with default: <skipcommon>
* @default skipcommon
*
* @help
* This is where a GOOD plugin developer would put the help information for your plugin.
* 
*/

var CommonEventRunner = CommonEventRunner || {};
CommonEventRunner.Plugins = CommonEventRunner.Plugins || {};
(function($) {

//=============================================================================
// PluginManager Parameters                                                             
//=============================================================================

  //Registers the Plugin for use 
  var parameters = PluginManager.parameters("MEE_RunCommonEventOnLoad");
  const CommonEventParams = {
    CommonEventNumber: Number(parameters['CommonEventNumber']),
    DontRunNoteTag: String(parameters['DontRunNoteTag']),
  };

  $.Plugins.RunCommonEventOnLoad = function($) {
    'use strict';
    var _Game_Map_setup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function() {
      _Game_Map_setup.apply(this, arguments);
      // Design check
      if ($gameTemp.isCommonEventReserved()) {
        console.error("Common event clash - attempted to run common event via plugin but common event already reserved.  Contact idiot author.")
        throw new Error ($gameTemp.reservedCommonEvent());
      }
      const mapExcluded = isMapExcluded(CommonEventParams.DontRunNoteTag);
      console.debug(`${mapExcluded? "Skipping " : ""}running event ${CommonEventParams.CommonEventNumber} ${mapExcluded ? "due to notetag" : ""}` );
      if (!mapExcluded)
        $gameTemp.reserveCommonEvent(CommonEventParams.CommonEventNumber)
    };

//=============================================================================
// Public API / Exports                                                             
//=============================================================================
    

  };
  // Private
  function isMapExcluded(notetagParam) {
    const note = $dataMap.note;
    const reg = new RegExp(`<\\s*${notetagParam}\\s*>`, "i");
    const match = reg.exec(note);
    return match !== null;
  }

  $.Plugins.RunCommonEventOnLoad();
})(CommonEventRunner);
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
  };

  $.Plugins.RunCommonEventOnLoad = function($) {
    'use strict';
    var _Game_Map_setup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function() {
      _Game_Map_setup.apply(this, arguments);
      $gameTemp.reserveCommonEvent(CommonEventParams.CommonEventNumber)
    };

//=============================================================================
// Public API / Exports                                                             
//=============================================================================
    

  };

  $.Plugins.RunCommonEventOnLoad();
})(CommonEventRunner);
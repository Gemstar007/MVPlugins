//=============================================================================
// PluginPattern.js                                                             
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

//Namespace for any code you create; replace this with your own name
const KiberianSucksD = {};

//Create a new namespace for plugins
KiberianSucksD.Plugins = {};

//Helpers for Utility Functions or for developer uses
KiberianSucksD.Helpers = {};

(function($) {

//=============================================================================
// PluginManager Parameters                                                             
//=============================================================================

  //Registers the Plugin for use 
  var parameters = PluginManager.parameters("MEE_RunCommonEventOnLoad");
  //A place that holds all the parameters from your plugin params above
  const PluginPatternParams = {
    CommonEventNumber: Number(parameters['CommonEventNumber']),
  };

  $.Plugins.RunCommonEventOnLoad = function($) {
    'use strict';
    var _Game_Map_setup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function() {
      _Game_Map_setup.apply(this, arguments);
      $gameTemp.reserveCommonEvent(PluginPatternParams.CommonEventNumber)
    };

//=============================================================================
// Public API / Exports                                                             
//=============================================================================
    

  };

  //Run All Plugin Code
  $.Plugins.RunCommonEventOnLoad();
})(KiberianSucksD);
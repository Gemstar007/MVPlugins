//=============================================================================
// MEE_CustomizeRunSpeed.js                                                             
//=============================================================================


/*:
* @author Jeremy Rentafred Muse
* @plugindesc Changes the default running speed.  Also adds Plugin Command "AdjustRunSpeed" (default name) 
*             where you can increment the current running speed.
*
* @param NewSpeed
* @desc Speed value to be added when running.  Game default: 1.  This Plugin default: 0.5.
*      
* @default 0.5
* 
* @param AdjustCommandName
* @desc Command to use in event plugin command creation to adjust run speed.  Value passed to command is added to existing run speed.
* @default AdjustRunSpeed
*
* @param ResetAdjustmentCommandName
* @desc Command to use in event plugin command creation to reset to plugin parameter value.
* @default ResetRunAdjustment
*
* @help
* Command usage:
*   Example: add 0.1 to current runspeed
*    AdjustRunSpeed 0.1
*   Example: reset to value passed to plugin 
*    ResetRunAdjustment
*/

var CustomizeRunSpeed = CustomizeRunSpeed || {};
CustomizeRunSpeed.Plugins = CustomizeRunSpeed.Plugins || {};
CustomizeRunSpeed.Helpers = CustomizeRunSpeed.Helpers || {};

(function($) {

//=============================================================================
// PluginManager Parameters                                                             
//=============================================================================
  var parameters = PluginManager.parameters("MEE_CustomizeRunSpeed");
  const CustomizeRunSpeedParams = {
    NewSpeed: Number(parameters['NewSpeed']),
    AdjustCommandName: String(parameters['AdjustCommandName']),
    ResetAdjustmentCommandName: String(parameters['ResetAdjustmentCommandName']),
  };
  let CurrentSpeed = CustomizeRunSpeedParams.NewSpeed;
  $.Plugins.CustomizeRunSpeed = function($) {
    'use strict';

    // overwrite prototype definition as additional speed from running is hardcoded
    overwriteRealMoveSpeed(CustomizeRunSpeedParams.NewSpeed);
    // Add commands
    let _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);

        switch (command) {
            case CustomizeRunSpeedParams.AdjustCommandName:
              if (args.length !== 1)
                throw new Error(`Incorrect using of Plugin Command ${CustomizeRunSpeedParams.AdjustCommandName}.  Expected 1 argument, got ${args.length}`);
              CurrentSpeed = parseFloat(args[0]) + CurrentSpeed;
              overwriteRealMoveSpeed(CurrentSpeed);
              break;

            case CustomizeRunSpeedParams.ResetAdjustmentCommandName:
              overwriteRealMoveSpeed(CustomizeRunSpeedParams.NewSpeed);
              CurrentSpeed = CustomizeRunSpeedParams.NewSpeed;
              break;
        }
      }
//=============================================================================
// Public API / Exports                                                             
//=============================================================================
  };
  // private
  function overwriteRealMoveSpeed(newRunSpeed) {
    Game_CharacterBase.prototype.realMoveSpeed = function() {
      return this._moveSpeed + (this.isDashing() ? newRunSpeed : 0);
    };
  }

  //Run All Plugin Code
  $.Plugins.CustomizeRunSpeed();
})(CustomizeRunSpeed);
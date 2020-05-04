//=============================================================================
// ExpMultiplier.js                                                             
//=============================================================================


/*:
*
* @author Jeremy Meese
* @plugindesc Adds a multiplier to xp gain based on how far below the map level you are.  
*             Requires you to add notetags per monster that is the expected player level. notetag: /<\s*level\s*:\s*(\d+)\s*>/i;
*             Leaving level blank will result in no multiplication
*             Caps at 5 level difference
*
* @param One Level Percent Multiplier
* @desc Multiplier to be added when one level below in percent (10 => 110% exp gain)
* @default 10
*
* @param Two Level Percent Multiplier
* @desc Multiplier to be added when two levels below in percent (10 => 110% exp gain)
* @default 20
*
* @param Three Level Percent Multiplier
* @desc Multiplier to be added when three levels below in percent (10 => 110% exp gain)
* @default 30
*
* @param Four Level Percent Multiplier
* @desc Multiplier to be added when four levels below in percent (10 => 110% exp gain)
* @default 40
*
* @param Five Level Percent Multiplier
* @desc Multiplier to be added when five levels or more below in percent (10 => 110% exp gain)
* @default 50
*
* @help
* This is no help
* 
*/

const ExpMultiplier = {};
//Create a new namespace for plugins
ExpMultiplier.Plugins = {};

//Helpers for Utility Functions or for developer uses
ExpMultiplier.Helpers = {};

(function($) {

//=============================================================================
// PluginManager Parameters                                                             
//=============================================================================

  //Registers the Plugin for use 
  var parameters = PluginManager.parameters("MEE_ExpMultiplier");
  //A place that holds all the parameters from your plugin params above
  const ExpMultiplierParams = {
    ExpMultParam: [
      0,
      Number(parameters['One Level Percent Multiplier']),
      Number(parameters['Two Level Percent Multiplier']),
      Number(parameters['Three Level Percent Multiplier']),
      Number(parameters['Four Level Percent Multiplier']),
      Number(parameters['Five Level Percent Multiplier']),
  ]};

  $.Plugins.AddExpMultiplier = function($) {
    'use strict';

    var _Game_Actor_gainExp = Game_Actor.prototype.gainExp;
    Game_Actor.prototype.gainExp = function(exp) {
      // Check we're gaining exp for killing baddies
      const deadTroops = $gameTroop.deadMembers();
      let bonusXp = 0;
      if (deadTroops !== undefined) {
        const actorLevel = this.level;
        bonusXp = $gameTroop.deadMembers().reduce(function(r, enemy) {
          const monsterLevel = getMonsterLevel($dataEnemies[enemy._enemyId].note)
          const levelDiff = Math.min(Math.max(monsterLevel - actorLevel, 0), 5); // between 0 and 5
          const multiplier = ExpMultiplierParams.ExpMultParam[levelDiff] / 100.0;
          return enemy.exp() * multiplier + r;
        }, 0);
      }
      _Game_Actor_gainExp.call(this, exp + bonusXp);
    }
//=============================================================================
// Public API / Exports                                                             
//=============================================================================
 
  };

  // Private
  function getMonsterLevel(note) {
    const monsterLevelTag = /<\s*level\s*:\s*(\d+)\s*>/i.exec(note);
    if (monsterLevelTag === null) {
      // no tag
      return 0;
    } 
    const monsterLevel = parseInt(monsterLevelTag[1]);
    if (isNaN(monsterLevel))
      return 0;
    return monsterLevel;

  }
  //Run All Plugin Code
  $.Plugins.AddExpMultiplier($);
})(ExpMultiplier);
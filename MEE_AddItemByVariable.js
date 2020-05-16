//=============================================================================
// MEE_AddItemByVariable.js                                                             
//=============================================================================
/*:
*
* @author Jeremy Romfrod Moise
* @plugindesc Adds a Plugin Command to add a weapon/armor/item based on its id. 
*
* @param CommandName
* @desc Command to use in event command creation
* @default AddItem
* 
* @help
* Usage:
* CommandName <Armor|Item|Weapon>|\v[[<variableNumber>]] <ItemId>|\v[[<variableNumber>]] [quantity|\v[[<variableNumber>]]]
* Note: [[]] denotes single square brackets
*
* Examples:
* Example 1 - add 3 of the Weapon with id 12
*   AddItem Weapon 12 3
* Example 2 - add 1 of the Item with id 1
*   AddItem Item 1
* Example 3 - quantity: value in variable 3.  Item: armor with itemId == value in variable.
*   AddItem Armor \v[2] \v[3]
*/

var AddItemByVariable = {};
AddItemByVariable.Plugins = {};
AddItemByVariable.Helpers = {};

(function($) {

//=============================================================================
// PluginManager Parameters                                                             
//=============================================================================

  var parameters = PluginManager.parameters("MEE_AddItemByVariable");
  const MEE_AddItemByVariableParams = {
    CommandName: String(parameters['CommandName'])
  };

  $.Plugins.AddItemByVariableCommand = function($) {
    'use strict';
    
    const variableMatch = /\\v\[(?<VariableNumber>\d+)\]/i;
    let _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        switch (command) {
            case MEE_AddItemByVariableParams.CommandName:
                if (args.length !== 2 && args.length !== 3)
                    throw new Error(`Incorrect using of Plugin Command MEE_AddItemByVariable.  Expected 2 or 3 arguments, got ${args.length}`);
                const itemType = parseForVariable(args[0]);
                const itemId = parseInt(parseForVariable(args[1]));
                const quantity = args.length >= 3 ? parseInt(parseForVariable(args[2])) : 1;
                if (quantity < 0)
                    throw new JoeError("Joe SPECIFICALLY SAID he wouldn't use the AddItem plugin command to take away items.")
                addItem(itemType, itemId, quantity);
                break;
        }
    };

    /**
     * @param {string} itemType
     * @param {number} itemId 
     * @param {number} quantity 
     */
    function addItem(itemType, itemId, quantity) {
        let baseItemArr;
        switch (itemType.toLowerCase()) {
            case "armor":
            case "armour": 
                baseItemArr = $dataArmors;
                break;
            case "item":
                baseItemArr = $dataItems;
                break;
            case "weapon":
                baseItemArr = $dataWeapons;
                break;
        }
        console.debug(`Adding ${quantity} of item:`);
        console.debug(baseItemArr[itemId]);
        // Notes, defaulting to "includeEquip" = false for this call, as that is
        // used to discard a party's equipment in the case of negative items.
        $gameParty.gainItem(baseItemArr[itemId], quantity);
    }

    /**
     * 
     * @param {string} str 
     */
    function parseForVariable(str) {
        const match = str.match(variableMatch);
        if (match && match.groups && match.groups.VariableNumber) {
            return $gameVariables.value(match.groups.VariableNumber);
        }
        return str;
    }

    class JoeError extends Error {}
//=============================================================================
// Public API / Exports                                                             
//=============================================================================
  };

  $.Plugins.AddItemByVariableCommand();
})(AddItemByVariable);
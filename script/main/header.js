/*

   Copyright [yyyy] [name of copyright owner]
   
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at
   
       http://www.apache.org/licenses/LICENSE-2.0
   
   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

*/

let $ = new JavaImporter();
// Needed to check if player has entered world.
$.importClass(InnerCorePackage.api.runtime.LevelInfo);

Translation.addTranslation("To find out item in hand IDs, load any world firstly.", {
	ru: "Чтобы узнать идентификатор предмета в руке, сначала загрузите мир."
});

/**
 * Displays a pop-up window that, when selected by an element,
 * will display the call code for this method.
 * @param {string} apiName modapi requires name
 */
const displayApiInformation = function(apiName) {
	let popup = new ExpandablePopup();
	popup.setTitle(apiName);
	let api = ModAPI.requireAPI(apiName);
	// Most convenient way to add content is with a fragment.
	let fragment = popup.getFragment();
	if (api && typeof api == "object") {
		for (let element in api) {
			let nonIterableElement = element;
			fragment.addSolidButton(element, function() {
				RuntimeCodeEvaluate.showSpecifiedDialog(
					"var api = ModAPI.requireAPI(\"" + apiName + "\");\n" +
					"api." + nonIterableElement + "();");
			});
		}
	} else {
		fragment.addExplanatory(translate("API is empty or declared incorrectly."))
	}
	// Opens a pop-up window, optionally specifying coordinates
	// or a widget next to which the window should appear.
	openPopup("api_information", popup);
};

/**
 * Displays brief information about the item in hand and displays
 * an extra in chat, if any.
 */
const displayItemInHandInformation = function() {
	let localPlayer = Player.get();
	let item = Entity.getCarriedItem(localPlayer);
	Game.tipMessage(item.id + ":" + item.data);
	if (item.extra) {
		Game.message(item.extra.asJson().toString(4));
	}
};

Translation.addTranslation("API is empty or declared incorrectly.", {
	ru: "API пустое или объявлено некорректно."
});

// There are a number of existing tools, but this one is
// one of the simplest and does not require a lot of configuration.
const TOOL = new SidebarTool({
	// Responsible for button window, which also includes loading window.
	controlDescriptor: {
		logotype: function(tool, control) {
			// Menu button icon can change, for example, during selection.
			return "template";
		}
	},
	
	// Controls layout of control menu, some widgets are natively built into tool template.
	menuDescriptor: {
		elements: [function(tool, json, menu) {
			if (!$.LevelInfo.isLoaded()) {
				return {
					type: "message",
					icon: "templateItem",
					message: translate("To find out item in hand IDs, load any world firstly.")
				};
			}
		}]
	},
	
	// Settings on right side of control area are basically groups with icon categories.
	// Despite this, it is recommended to specify action names in advance.
	sidebarDescriptor: {
		groups: [{
			icon: "template",
			items: [{
				icon: "templateEvaluate",
				// Some translations are already built into core.
				title: translate("Evaluate")
			}, {
				icon: "explorerImport",
				title: translate("Import")
			}, function(tool, group, json) {
				// Most of items and elements in tool can be functions, they will be called in
				// general `describe` method. This item will appear after entering into world.
				if ($.LevelInfo.isLoaded()) {
					return {
						icon: "templateItem",
						title: translate("Identifier")
					};
				}
			}, {
				// In addition to functions, an icon can be a description object, explore
				// core Drawable library for more details or use declarations.
				icon: {
					bitmap: "templateSomething",
					// It is a good practice to add items whose functions will be added later.
					// For example, yellow color describes incompletely implemented functionality.
					tint: android.graphics.Color.RED
				},
				title: translate("Something")
			}]
		}, {
			icon: "templateApi",
			items: function(tool, group) {
				let elements = [];
				// Getting all currently available APIs.
				for (let name in ModAPI.modAPIs) {
					elements.push({
						icon: "templateSomething",
						title: translate(name)
					});
				}
				return elements;
			}
		}]
	},
	
	// Clicking a sidebar item in selected category.
	onSelectItem: function(sidebar, group, item, groupIndex, itemIndex) {
		if (groupIndex == 0) {
			if (itemIndex >= 2 && !$.LevelInfo.isLoaded()) {
				// For item identifier output.
				itemIndex++;
			}
			if (itemIndex == 0) {
				return RuntimeCodeEvaluate.showSpecifiedDialog();
			} else if (itemIndex == 1) {
				return RuntimeCodeEvaluate.loadEvaluate();
			} else if (itemIndex == 2) {
				return displayItemInHandInformation();
			}
			// One more element is ignored, because it is not implemented yet and
			// corresponding inscription will be displayed.
		} else if (groupIndex == 1) {
			return displayApiInformation(item.getTitle());
		}
		showHint(translate("Not developed yet"));
	},
	
	// Holding a category element in sidebar.
	onFetchGroup: function(sidebar, group, index) {
		if (index == 0) {
			return translate("Some information");
		} else if (index == 1) {
			return translate("ModAPIs");
		}
		// In general, you can return nothing if there is no specific text,
		// but then user might think that something is not working correctly.
		return translate("Deprecated translation");
	},
	
	// Holding a menu item in sidebar.
	onFetchItem: function(sidebar, group, item, groupIndex, itemIndex) {
		if (groupIndex == 0) {
			if (itemIndex >= 2 && !$.LevelInfo.isLoaded()) {
				// For item identifier output.
				itemIndex++;
			}
			if (itemIndex == 0) {
				return translate("Shows code execution window");
			} else if (itemIndex == 1) {
				return translate("Opens a script for evaluation");
			} else if (itemIndex == 2) {
				return translate("Displays information about in hand item");
			} else if (itemIndex == 3) {
				return translate("Obviously does nothing useful");
			}
		} else if (groupIndex == 1) {
			return item.getTitle();
		}
		return translate("Deprecated translation");
	}
});

// To add resources, just use method from the Drawable library.
// Textures will only be loaded when needed, so you don't
// have to worry about performance. Without a slash at end,
// all mapped icon names will be capitalized. 
BitmapDrawableFactory.mapDirectory(__dir__ + "ui/", true);

// You can describe your tool using a unique name so that
// Modding Tools can recognize which ID your tool is located by.
// For example, a banal "tileentity" or "modapi" would be a good name.
registerMenuTool("template", TOOL);

// If tool should not be in main Modding Tools menu, but should be
// launched in some special way, use `registerTool(id, tool)` instead.

Translation.addTranslation("Something", {
	ru: "Что-то"
});
Translation.addTranslation("Some information", {
	ru: "Некоторая информация"
});
Translation.addTranslation("Shows code execution window", {
	ru: "Некоторая информация"
});
Translation.addTranslation("Opens a script for evaluation", {
	ru: "Некоторая информация"
});
Translation.addTranslation("Displays information about in hand item", {
	ru: "Некоторая информация"
});
Translation.addTranslation("Obviously does nothing useful", {
	ru: "Очевидно, не делает ничего полезного"
});

// Among other things, tool should add features as you entering world
// for example. This will update the menu items, rebuilding interface,
// you can also use `describe` to update everything.
Callback.addCallback("LevelDisplayed", function() {
	if (TOOL.isAttached()) {
		handle(function() {
			// Removing non-actual hints.
			TOOL.describeMenu();
			// Adding a menu item.
			TOOL.describeSidebar();
		});
	}
});

Callback.addCallback("LevelLeft", function() {
	if (TOOL.isAttached()) {
		handle(function() {
			// Removing inaccessible item.
			TOOL.describeMenu();
			// Returning necessary item again.
			TOOL.describeSidebar();
		});
	}
});

const launchModification = function(additionalScope) {
	if (additionalScope !== undefined) {
		__mod__.RunMod(additionalScope);
		return;
	}
	Launch();
};

let isOutdated = false;

ModAPI.addAPICallback("ModdingTools", function(api) {
	api = ModAPI.cloneAPI(api, false);
	api.isOutdated = isOutdated;
	launchModification(api);
});

(function() {
	try {
		ConfigureMultiplayer({
			isClientOnly: true
		});
	} catch (e) {
		isOutdated = true;
	}
})();

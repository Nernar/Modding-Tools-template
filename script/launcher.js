const launchModification = function(additionalScope) {
	if (additionalScope !== undefined) {
		__mod__.RunMod(additionalScope);
		return;
	}
	Launch();
};

let isOutdated = false;

Callback.addCallback("ModdingTools", function(api) {
	// To keep original api object clean, editing
	// can break launcher of other modules
	api = api.assign({}, api);
	api.isOutdated = isOutdated;
	launchModification(api);
});

(function() {
	try {
		ConfigureMultiplayer({
			isClientOnly: true
		});
	} catch (e) {
		// Once there was no multiplayer
		isOutdated = true;
	}
})();

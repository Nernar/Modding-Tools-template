try {
	ConfigureMultiplayer({
		isClientOnly: true
	});
	Callback.addCallback("ModdingTools", function(api) {
		// Checks to be able to run by mod and core version,
		// first two digits in mod.info defines API version,
		// so change them only when updating Modding Tools.
		api.launchIfSupported(__mod__, parseFloat(__mod__.getInfoProperty("version")));
	});
} catch (e) {
	// Change to your template name, e.g. ModdingTools-tileentity.
	Logger.Log("ModdingTools-template: Client outdated, module is not supported! Please, upgrade Inner Core to Horizon.", "ERROR");
}

try {
	ConfigureMultiplayer({
		isClientOnly: {clientOnly}
	});
	Callback.addCallback("ModdingTools", function(api) {
		api.launchIfSupported(__mod__, parseFloat(__mod__.getInfoProperty("version")));
	});
} catch (e) {
	Logger.Log("{name}: Client outdated, module is not supported! Please, upgrade Inner Core to Horizon.", "ERROR");
}

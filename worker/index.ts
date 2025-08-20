export default {
	async fetch(request: Request, env: Env) {
		try {
			// Try to serve the requested asset
			const asset = await env.ASSETS.fetch(request);
			if (asset.status === 200) {
				return asset;
			}
		} catch (error) {
			// Asset not found, continue to SPA fallback
		}

		// Serve index.html for SPA routing
		const indexResponse = await env.ASSETS.fetch(new URL("/index.html", request.url));
		if (indexResponse.status === 200) {
			return indexResponse;
		}

		// Fallback to 404
		return new Response(null, { status: 404 });
	},
} satisfies ExportedHandler<Env>;

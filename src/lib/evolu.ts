import { SimpleName, createEvolu, getOrThrow } from "@evolu/common";
import { NonEmptyString100, NonEmptyString1000, id, nullOr } from "@evolu/common";
import { evoluReactWebDeps } from "@evolu/react-web";

const EVOLU_INSTANCE = "pocker-3241038978";

const AboutId = id("About");
type AboutId = typeof AboutId.Type;

const BookmarkId = id("Bookmark");
type BookmarkId = typeof BookmarkId.Type;

const Schema = {
	about: {
		id: AboutId,
		version: NonEmptyString100,
	},
	bookmark: {
		id: BookmarkId,
		mark: NonEmptyString100,
		url: NonEmptyString1000,
		title: NonEmptyString1000,
		favicon: nullOr(NonEmptyString100),
		description: nullOr(NonEmptyString1000),
		category: NonEmptyString100,
	},
};

export const evoluInstance = createEvolu(evoluReactWebDeps)(Schema, {
	name: getOrThrow(SimpleName.from(EVOLU_INSTANCE)),

	// Disable sync for development to avoid WebSocket connection issues
	// syncUrl: undefined, // optional, defaults to https://free.evoluhq.com

	onInit: ({ isFirst }) => {
		isFirst && evoluInstance.insert("about", { version: "1.0.0" });
	},
});

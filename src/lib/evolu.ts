import { SimpleName, createAppOwner, createEvolu, getOrThrow } from "@evolu/common";
import { NonEmptyString100, NonEmptyString1000, id, nullOr, Mnemonic } from "@evolu/common";
import { evoluReactWebDeps } from "@evolu/react-web";
import { APP_OWNER_MNEMONIC, EVOLU_INSTANCE } from "./constants";

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

const evoluName = getOrThrow(SimpleName.from(EVOLU_INSTANCE));
const appOwnerMnemonic = getOrThrow(Mnemonic.from(APP_OWNER_MNEMONIC));
export const evoluInstance = createEvolu(evoluReactWebDeps)(Schema, {
	name: evoluName,
	initialAppOwner: createAppOwner(appOwnerMnemonic),
	onInit: ({ isFirst }) => {
		isFirst && evoluInstance.insert("about", { version: "1.0.0" });
	},
});

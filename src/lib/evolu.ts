import {
	createEvolu,
	createFormatTypeError,
	id,
	type MaxLengthError,
	type MinLengthError,
	NonEmptyString100,
	NonEmptyString1000,
	nullOr
} from "@evolu/common";
import { evoluReactWebDeps } from "@evolu/react-web";

const BookmarkId = id("Bookmark");

const Schema = {
	bookmark: {
		id: BookmarkId,
		url: NonEmptyString1000,
		title: NonEmptyString1000,
		favicon: nullOr(NonEmptyString100),
		description: nullOr(NonEmptyString1000),
		category: NonEmptyString100,
	},
};

export const evoluInstance = createEvolu(evoluReactWebDeps)(Schema, {
	transports: [
		{ type: "WebSocket", url: "wss://evolu-relay-1.artlu.xyz" },
		{ type: "WebSocket", url: "wss://free.evoluhq.com" },
	],
});

/**
 * Formats Evolu Type errors into user-friendly messages.
 *
 * Evolu Type typed errors ensure every error type used in schema must have a
 * formatter. TypeScript enforces this at compile-time, preventing unhandled
 * validation errors from reaching users.
 *
 * The `createFormatTypeError` function handles both built-in and custom errors,
 * and lets us override default formatting for specific errors.
 *
 * Click on `createFormatTypeError` below to see how to write your own
 * formatter.
 */
export const formatTypeError = createFormatTypeError<
	MinLengthError | MaxLengthError
>((error): string => {
	switch (error.type) {
		case "MinLength":
			return `Text must be at least ${error.min} character${error.min === 1 ? "" : "s"} long`;
		case "MaxLength":
			return `Text is too long (maximum ${error.max} characters)`;
	}
});

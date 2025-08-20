export interface BookmarkInstance {
	id: string;
	url: string;
	title: string;
	favicon?: string;
	createdAt: string;
	updatedAt: string;
	category: string;
	description?: string;
}

export interface BookmarksData {
	mark: string;
	bookmarks: BookmarkInstance[];
}
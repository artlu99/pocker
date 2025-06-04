export interface NameApi {
    name: string;
} 

export interface BookmarkInstance {
	uuid: string;
	url: string;
	title: string;
	favicon?: string;
	createdAt: string;
	modifiedAt: string;
	category: string;
	description?: string;
}

export interface BookmarksData {
	mark: string;
	bookmarks: BookmarkInstance[];
}
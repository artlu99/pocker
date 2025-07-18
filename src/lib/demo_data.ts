import type { BookmarksData } from "../../shared/types";

// 演示用的书签数据
export const DEMO_BOOKMARKS_DATA: BookmarksData = {
	mark: "demo",
	bookmarks: [
		{
			uuid: "4d283ee2-1c03-4d39-89e4-910989028ae1",
			url: "https://chat.openai.com",
			title: "ChatGPT",
			favicon: "https://chat.openai.com/favicon.ico",
			createdAt: new Date(2023, 0, 1).toISOString(),
			modifiedAt: new Date(2023, 0, 1).toISOString(),
			category: "AI Tools",
			description: "Conversational AI assistant developed by OpenAI",
		},
		{
			uuid: "62e24d2a-a1ab-49f3-899c-6b9212077605",
			url: "https://github.com",
			title: "GitHub",
			favicon: "https://github.com/favicon.ico",
			createdAt: new Date(2023, 0, 2).toISOString(),
			modifiedAt: new Date(2023, 0, 2).toISOString(),
			category: "Development Tools",
			description: "The world's largest code hosting platform",
		},
		{
			uuid: "67d1a74c-5f5d-4734-b22b-823848fea115",
			url: "https://reactjs.org",
			title: "React",
			favicon: "https://reactjs.org/favicon.ico",
			createdAt: new Date(2023, 0, 3).toISOString(),
			modifiedAt: new Date(2023, 0, 3).toISOString(),
			category: "Development Tools",
			description: "JavaScript library for building user interfaces",
		},
		{
			uuid: "e1cd6e04-0f83-41cd-a99b-4d4bc26b015f",
			url: "https://nextjs.org",
			title: "Next.js",
			favicon: "https://nextjs.org/favicon.ico",
			createdAt: new Date(2023, 0, 4).toISOString(),
			modifiedAt: new Date(2023, 0, 4).toISOString(),
			category: "Development Tools",
			description: "React framework for production applications",
		},
		{
			uuid: "06acb5e2-4373-4aaf-900d-f4e740267501",
			url: "https://www.coursera.org",
			title: "Coursera",
			favicon: "https://www.coursera.org/favicon.ico",
			createdAt: new Date(2023, 0, 5).toISOString(),
			modifiedAt: new Date(2023, 0, 5).toISOString(),
			category: "Learning Resources",
			description: "Online courses from universities worldwide",
		},
		{
			uuid: "f36a531c-10e3-42b3-953c-52ac74668cbf",
			url: "https://www.figma.com",
			title: "Figma",
			favicon: "https://www.figma.com/favicon.ico",
			createdAt: new Date(2023, 0, 6).toISOString(),
			modifiedAt: new Date(2023, 0, 6).toISOString(),
			category: "Design Resources",
			description: "Browser-based interface design tool",
		},
		{
			uuid: "8db6a3e1-a4ec-4a7c-94e5-3524b627cdc6",
			url: "https://news.ycombinator.com",
			title: "Hacker News",
			favicon: "https://news.ycombinator.com/favicon.ico",
			createdAt: new Date(2023, 0, 7).toISOString(),
			modifiedAt: new Date(2023, 0, 7).toISOString(),
			category: "News & Information",
			description:
				"Social news website focused on computer science and entrepreneurship",
		},
		{
			uuid: "276b97ba-1596-4553-b4a1-014b92d83d8f",
			url: "https://claude.ai",
			title: "Claude AI",
			favicon: "https://claude.ai/favicon.ico",
			createdAt: new Date(2023, 0, 8).toISOString(),
			modifiedAt: new Date(2023, 0, 8).toISOString(),
			category: "AI Tools",
			description: "AI assistant developed by Anthropic",
		},
		{
			uuid: "b063e870-a9e6-4fc1-8f17-f425e0e9b346",
			url: "https://www.midjourney.com",
			title: "Midjourney",
			favicon: "https://www.midjourney.com/favicon.ico",
			createdAt: new Date(2023, 0, 9).toISOString(),
			modifiedAt: new Date(2023, 0, 9).toISOString(),
			category: "AI Tools",
			description: "AI image generation tool",
		},
		{
			uuid: "289309e8-1728-42cd-8a1a-5ba4216ba60b",
			url: "https://tailwindcss.com",
			title: "Tailwind CSS",
			favicon: "https://tailwindcss.com/favicon.ico",
			createdAt: new Date(2023, 0, 10).toISOString(),
			modifiedAt: new Date(2023, 0, 10).toISOString(),
			category: "Development Tools",
			description: "Utility-first CSS framework",
		},
	],
};

import { Link, Route, Switch } from "wouter";
import "./app.css";
import { Navigation } from "./components/Navigation";
import { ApiAddHandler } from "./routes/ApiAddHandler";
import { BookmarksPage } from "./routes/BookmarksPage";
import { Doc } from "./routes/Doc";
import { Landing } from "./routes/Landing";

function App() {
	return (
		<div className="min-h-screen flex flex-col relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,rgba(147,51,234,0.15),transparent_70%),radial-gradient(ellipse_at_right,rgba(59,130,246,0.15),transparent_70%)]">
			{/* Header */}
			<header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
				<div className="container flex h-14 items-center">
					<Link
						href="/"
						className="flex items-center space-x-2 transition-transform duration-200 hover:scale-105"
					>
						<img
							src="/icon1.svg"
							alt="Pocker logo"
							width={24}
							height={24}
							className="h-6 w-6 text-primary"
						/>
						<span className="font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-500 to-purple-500">
							Pocker
						</span>
					</Link>

					<Navigation />
				</div>
			</header>

			{/* Main */}
			<div>
				<main className="flex-1">
					<Switch>
						<Route path="/" component={Landing} />
						<Route path="/doc" component={Doc} />
						<Route path="/api/add" component={ApiAddHandler} />
						<Route path="/:mark" component={BookmarksPage} />
						{/* Default route in a switch */}
						<Route>404: No such page!</Route>
					</Switch>
				</main>
			</div>

			{/* Footer */}
			<footer className="border-t border-border/40 mt-auto">
				<div className="container flex flex-col gap-2 py-6 text-center">
					<p className="text-xs text-muted-foreground">
						Released under the AGPL License.
					</p>
					<p className="text-xs text-muted-foreground">
						fork: <Link
							href="https://github.com/wesleyel/cloudmark"
							className="hover:text-primary"
							target="_blank"
							rel="noopener noreferrer"
						>
							Next.js/React + Cloudflare KV by Wesley Yang
						</Link> → <Link
							href="https://evolu.dev"
							className="hover:text-primary"
							target="_blank"
							rel="noopener noreferrer"
						>
							Evolu by steida
						</Link>
					</p>
					<p className="text-xs text-muted-foreground">
						Copyright © {new Date().getFullYear()}{" "}
						<Link
							href="https://github.com/artlu99"
							className="hover:text-primary"
							target="_blank"
							rel="noopener noreferrer"
						>
							artlu99
						</Link>
					</p>
				</div>
			</footer>
		</div>
	);
}

export default App;

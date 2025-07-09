import type { AppType } from "next/app";
import "./globals.css";
import { ThemeProvider } from "./_components/theme-provider";

import { geist, lexend, geistMono } from "./(fonts)/fonts";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const MyApp: AppType = ({ Component, pageProps }) => {
	return (
		<ClerkProvider
			{...pageProps}
			appearance={{
				cssLayerName: "clerk",
				baseTheme: dark,
			}}
		>
			<ThemeProvider
				attribute="class"
				defaultTheme="dark"
				enableSystem
				disableTransitionOnChange
			>
				<div className={geist.className}>
					<Component {...pageProps} />
				</div>
			</ThemeProvider>
		</ClerkProvider>
	);
};

export default MyApp;

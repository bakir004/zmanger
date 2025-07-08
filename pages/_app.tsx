import type { AppType } from "next/app";
import "./globals.css";
import { ThemeProvider } from "./_components/theme-provider";

import { geist, lexend } from "./(fonts)/fonts"; // adjust path as needed
import { ClerkProvider } from "@clerk/nextjs";

const MyApp: AppType = ({ Component, pageProps }) => {
	return (
		<ClerkProvider
			{...pageProps}
			appearance={{
				cssLayerName: "clerk",
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

import { useSignIn, useUser } from "@clerk/nextjs";
import { getAuth } from "@clerk/nextjs/server";
import type { GetServerSidePropsContext } from "next";

export const getServerSideProps = async ({
	req,
}: GetServerSidePropsContext) => {
	const { userId } = getAuth(req);

	if (userId) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}

	return { props: {} };
};

export default function SignInPage() {
	const { signIn } = useSignIn();
	const { user } = useUser();

	const signInWith = (provider: "github" | "google") => {
		signIn?.authenticateWithRedirect({
			strategy: `oauth_${provider}`,
			redirectUrl: "/",
			redirectUrlComplete: "/dashboard",
		});
	};

	return (
		<div className="space-y-2">
			<button type="button" onClick={() => signInWith("google")}>
				Sign in with Google
			</button>
			<button type="button" onClick={() => signInWith("github")}>
				Sign in with GitHub
			</button>
		</div>
	);
}

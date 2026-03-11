import { useState } from "react";
import { useAccountSession } from "@/components/account-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	type LoginInput,
	type RegisterInput,
	useLogin,
	useRefreshCurrentUser,
	useRegister,
} from "@/query";

function LoginForm() {
	const { saveCurrentUser } = useAccountSession();
	const loginMutation = useLogin();
	const [form, setForm] = useState<LoginInput>({
		email: "user1@email.com",
		password: "hashedpass1",
	});

	function updateField(field: keyof LoginInput, value: string) {
		setForm((current) => ({
			...current,
			[field]: value,
		}));
	}

	function submit() {
		loginMutation.mutate(form, {
			onSuccess: saveCurrentUser,
		});
	}

	return (
		<form
			className="grid gap-4"
			onSubmit={(event) => {
				event.preventDefault();
				void submit();
			}}
		>
			<div className="grid gap-2">
				<Label htmlFor="login-email">Email</Label>
				<Input
					id="login-email"
					type="email"
					value={form.email}
					onChange={(event) => updateField("email", event.target.value)}
					required
				/>
			</div>

			<div className="grid gap-2">
				<Label htmlFor="login-password">Password</Label>
				<Input
					id="login-password"
					type="password"
					value={form.password}
					onChange={(event) => updateField("password", event.target.value)}
					required
				/>
			</div>

			<Button type="submit" disabled={loginMutation.isPending}>
				{loginMutation.isPending ? "Signing in..." : "Sign in"}
			</Button>
		</form>
	);
}

function RegisterForm() {
	const { saveCurrentUser } = useAccountSession();
	const registerMutation = useRegister();
	const [form, setForm] = useState<RegisterInput>({
		email: "",
		username: "",
		password: "",
	});

	function updateField(field: keyof RegisterInput, value: string) {
		setForm((current) => ({
			...current,
			[field]: value,
		}));
	}

	function submit() {
		registerMutation.mutate(form, {
			onSuccess: (user) => {
				saveCurrentUser(user);
				setForm({
					email: "",
					username: "",
					password: "",
				});
			},
		});
	}

	return (
		<form
			className="grid gap-4"
			onSubmit={(event) => {
				event.preventDefault();
				void submit();
			}}
		>
			<div className="grid gap-2">
				<Label htmlFor="register-email">Email</Label>
				<Input
					id="register-email"
					type="email"
					value={form.email}
					onChange={(event) => updateField("email", event.target.value)}
					required
				/>
			</div>

			<div className="grid gap-2">
				<Label htmlFor="register-username">Username</Label>
				<Input
					id="register-username"
					value={form.username}
					onChange={(event) => updateField("username", event.target.value)}
					required
				/>
			</div>

			<div className="grid gap-2">
				<Label htmlFor="register-password">Password</Label>
				<Input
					id="register-password"
					type="password"
					value={form.password}
					onChange={(event) => updateField("password", event.target.value)}
					required
				/>
			</div>

			<Button type="submit" disabled={registerMutation.isPending}>
				{registerMutation.isPending ? "Creating account..." : "Create account"}
			</Button>
		</form>
	);
}

function AccountDetails() {
	const { currentUser, clearCurrentUser, saveCurrentUser } =
		useAccountSession();
	const refreshCurrentUser = useRefreshCurrentUser();

	if (!currentUser) {
		return null;
	}

	function logout() {
		clearCurrentUser();
	}

	function refresh() {
		refreshCurrentUser.mutate(undefined, {
			onSuccess: saveCurrentUser,
		});
	}

	return (
		<div className="grid gap-4">
			<div className="grid gap-1">
				<h2 className="text-lg font-semibold">{currentUser.username}</h2>
				<p className="text-sm text-muted-foreground">{currentUser.email}</p>
			</div>

			<div className="grid gap-2 text-sm">
				<div>
					<span className="font-medium">Account ID:</span>{" "}
					{currentUser.accountId}
				</div>
				<div>
					<span className="font-medium">Account Type:</span>{" "}
					{currentUser.accountType}
				</div>
			</div>

			<div className="flex gap-2">
				<Button
					type="button"
					variant="outline"
					onClick={refresh}
					disabled={refreshCurrentUser.isPending}
				>
					{refreshCurrentUser.isPending ? "Refreshing..." : "Refresh"}
				</Button>
				<Button type="button" variant="outline" onClick={logout}>
					Log out
				</Button>
			</div>
		</div>
	);
}

export function Login() {
	const { currentUser } = useAccountSession();
	const [mode, setMode] = useState<"login" | "register">("login");

	return (
		<Card>
			{currentUser ? null : (
				<CardHeader className="gap-4">
					<div className="flex gap-2 rounded-lg bg-muted p-1">
						<Button
							type="button"
							variant={mode === "login" ? "default" : "ghost"}
							className="flex-1"
							onClick={() => setMode("login")}
						>
							Login
						</Button>
						<Button
							type="button"
							variant={mode === "register" ? "default" : "ghost"}
							className="flex-1"
							onClick={() => setMode("register")}
						>
							Register
						</Button>
					</div>
				</CardHeader>
			)}

			<CardContent>
				{currentUser ? (
					<AccountDetails />
				) : mode === "login" ? (
					<LoginForm />
				) : (
					<RegisterForm />
				)}
			</CardContent>
		</Card>
	);
}

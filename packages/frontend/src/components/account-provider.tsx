import { createContext, type ReactNode, useContext, useState } from "react";
import {
	type AuthUser,
	getStoredCurrentUser,
	persistCurrentUser,
} from "@/query";

type AccountContextValue = {
	currentUser: AuthUser | null;
	saveCurrentUser: (user: AuthUser) => void;
	clearCurrentUser: () => void;
};

const AccountContext = createContext<AccountContextValue | null>(null);

export function AccountProvider({ children }: { children: ReactNode }) {
	const [currentUser, setCurrentUser] = useState<AuthUser | null>(() =>
		getStoredCurrentUser(),
	);

	function saveCurrentUser(user: AuthUser) {
		setCurrentUser(user);
		persistCurrentUser(user);
	}

	function clearCurrentUser() {
		setCurrentUser(null);
		persistCurrentUser(null);
	}

	return (
		<AccountContext.Provider
			value={{
				currentUser,
				saveCurrentUser,
				clearCurrentUser,
			}}
		>
			{children}
		</AccountContext.Provider>
	);
}

export function useAccountSession() {
	const context = useContext(AccountContext);

	if (!context) {
		throw new Error("useAccountSession must be used within AccountProvider");
	}

	return context;
}

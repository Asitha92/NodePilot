import { ADMIN_ROLE, USER_ROLE } from '../../constants';

export type FormData = Record<string, string | null> | null;

export interface User {
	email: string;
	userName: string;
	role: typeof ADMIN_ROLE | typeof USER_ROLE;
	id: string;
}

export interface InitialState {
	isLoading: boolean;
	isAuthenticated: boolean;
	user: User | null;
	token: string | null;
}

export type ApiResponse<T> = {
	ok: boolean;
	msg: string;
	data: T;
};

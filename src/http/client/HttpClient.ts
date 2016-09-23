export type HeaderSet = { [headerName: string]: string };

export interface RemoteResponse {
    statusCode(): number;
    headers(): HeaderSet;
    content(): any;
    isJSON(): boolean;
}

export interface User {
    id: number;
    firstName: string;
}

export interface Profile {
    id: number;
    firstName: string;
}

export interface UserStats {
    messageCount: number;
}

export interface HttpClient {
    get<T>(url: string, headers?: HeaderSet): Promise<T>;
    post<T>(url: string, content?: any, headers?: HeaderSet): Promise<T>;
    put<T>(url: string, content?: any, headers?: HeaderSet): Promise<T>;
}

export class ServiceUnavailable extends Error {

    private _error: Error;

    constructor(error: Error) {
        super();
        this.name = "ServiceUnavailable";
        this._error = error;
    }

    get error(): Error {
        return this._error;
    }
}

const fetchMyStats = async (userService: HttpClient, statsService: HttpClient) => {

    try {
        const me = await userService.get<User>("/users/me");
        const myStats = await statsService.get<UserStats>(`/user-stats/${me.id}`);

        return {
            firstName: me.firstName,
            messageCount: myStats.messageCount
        };

    } catch (error) {
        throw new ServiceUnavailable(error);
    }
};

const signUp = async (profileService: HttpClient, authenticationService: HttpClient) => {

    try {
        const profile = await profileService.post<Profile>("/profiles", {
            firstName: "Alex"
        });

        await authenticationService.put(`/credentials/${profile.id}`, {
            email: "alex@company.com",
            password: "qwe123__"
        });

        return {
            id: profile.id,
            firstName: profile.firstName,
        };

    } catch (error) {
        throw new ServiceUnavailable(error);
    }
};
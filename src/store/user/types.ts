interface SignUpUserType {
    email: string;
    password: string;
}
interface UserState {
    userName: string;
    email: string;
    password: string;
}

interface LoginUserType {
    email: string;
    password: string;
}

export { SignUpUserType, LoginUserType, UserState };

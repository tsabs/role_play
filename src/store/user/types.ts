interface SignUpUserType {
    email: string;
    password: string;
    role: string;
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

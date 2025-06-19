interface SignUpUserType {
    email: string;
    password: string;
}
interface UserState {
    email: string;
    uuid: string;
}

interface LoginUserType {
    email: string;
    password: string;
}

export { SignUpUserType, LoginUserType, UserState };

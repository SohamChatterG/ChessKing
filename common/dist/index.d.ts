import z from 'zod';
declare const signUpInput: z.ZodObject<{
    username: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    username: string;
    email: string;
    password: string;
}, {
    username: string;
    email: string;
    password: string;
}>;
type SignUpInput = z.infer<typeof signUpInput>;
declare const signInInput: z.ZodObject<{
    email: z.ZodOptional<z.ZodString>;
    username: z.ZodOptional<z.ZodString>;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password: string;
    username?: string | undefined;
    email?: string | undefined;
}, {
    password: string;
    username?: string | undefined;
    email?: string | undefined;
}>;
type SignInInput = z.infer<typeof signInInput>;
export { SignInInput, SignUpInput, signInInput, signUpInput };

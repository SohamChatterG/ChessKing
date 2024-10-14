import z from 'zod'

const signUpInput = z.object({
    username : z.string(),
    email: z.string().email(),
    password : z.string().min(8)

})

type SignUpInput = z.infer<typeof signUpInput>

const signInInput = z.object({
    // Both email and username are marked as optional using z.string().optional().
    email: z.string().email().optional(),
    username : z.string().optional(),
    password : z.string().min(8)
}) // The refine method is used to enforce that at least one of the fields (email or username) must be provided.

type SignInInput = z.infer<typeof signInInput>

export {
    SignInInput,
    SignUpInput,
    signInInput,
    signUpInput
}
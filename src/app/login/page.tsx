import { signIn } from "@/lib/auth"

export default function LoginPage() {
  return (
    <form
      action={async (formData) => {
        "use server"
        await signIn("resend", formData)
      }}
    >
      <label htmlFor="email">Email</label>
      <input type="email" id="email" name="email" />
      <button type="submit">Sign in with Email</button>
    </form>
  )
} 
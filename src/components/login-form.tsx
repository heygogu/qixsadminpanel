"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import LoginImage from "@/app/assets/images/sidelogin.jpg"
import Image from "next/image"
import React from "react"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import ProjectIcon from "@/app/assets/images/qixsnobg.svg"
import henceforthApi from "@/app/utils/henceforthApis"
import { useGlobalContext } from "@/app/providers/Provider"
import { useRouter } from "next/navigation"
import { setCookie } from "nookies"
import path from "path"
interface AdminInfo {
  _id: string;
  email: string;
  name: string;
  super_admin: boolean;
  roles: string[];
  profile_pic: string | null;
  created_at: number;
  updated_at: number;
  access_token: string;
}
export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  // const [userInfo, setUserInfo] = React.useState<AdminInfo | null>(null)
  const { getProfile, Toast } = useGlobalContext()
  const router = useRouter()
  const [password, setPassword] = React.useState("qwerty")
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)


  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    const payload = {
      email: e.currentTarget.email.value,
      password: e.currentTarget.password.value
    }
    try {
      const apiRes = await henceforthApi.SuperAdmin.login(payload);
      // setUserInfo(apiRes?.data)
      if (apiRes?.data?.access_token) {
        henceforthApi.setToken(apiRes?.data?.access_token)
        setCookie(null, "COOKIES_ADMIN_ACCESS_TOKEN", apiRes?.data?.access_token, {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
        })
        await getProfile()
        router.replace("/dashboard")

      }
    } catch (error) {
      Toast.error(error)
    } finally {
      setIsLoading(false)
    }

  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 items-center md:grid-cols-2">
          <form onSubmit={handleLogin} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <Image src={ProjectIcon.src} width={90} height={90} alt="project logo"></Image>
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your QIXS account
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={"admin@gmail.com"}
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  {password.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-500 transition duration-300 ease-in-out" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-500 transition duration-300 ease-in-out" />
                      )}
                    </button>
                  )}
                </div>
              </div>
              <Button type="submit" className="w-full">
                {isLoading && <Loader2 className="w-5 h-5 animate-spin" />} Login
              </Button>

            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <Image src={LoginImage} alt="login-image" className="h-full"></Image>
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}

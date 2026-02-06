"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { authenticate } from "@/lib/auth-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Lock } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function LoginPage() {
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = async (formData: FormData) => {
        const result = await authenticate(undefined, formData);
        if (result) {
            setErrorMessage(result);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4">
            <Card className="w-full max-w-sm shadow-xl">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-primary/10 p-3">
                            <Lock className="w-6 h-6 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-center">관리자 로그인</CardTitle>
                    <CardDescription className="text-center">
                        가디언 포스트 관리자 패널에 접속합니다
                    </CardDescription>
                </CardHeader>
                <form action={handleLogin}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">비밀번호</Label>
                            <Input id="password" name="password" type="password" required placeholder="관리자 비밀번호" />
                        </div>

                        {errorMessage && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{errorMessage}</AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                    <CardFooter>
                        <SubmitButton />
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <Button className="w-full" aria-disabled={pending}>
            {pending ? "인증 확인 중..." : "로그인"}
        </Button>
    )
}

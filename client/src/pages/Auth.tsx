import { useState } from "react";
import { useLogin, useRegister, useUser } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function Auth() {
  const [_, setLocation] = useLocation();
  const { data: user } = useUser();
  const { mutateAsync: login, isPending: isLoginPending } = useLogin();
  const { mutateAsync: register, isPending: isRegisterPending } = useRegister();
  const { toast } = useToast();

  // Redirect if already logged in
  if (user) {
    setLocation(user.role === 'admin' ? '/admin' : '/dashboard');
    return null;
  }

  // State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ username, password });
      toast({ title: "Welcome back!", description: "Logged in successfully." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Login failed", description: err.message });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ username, password, name, email, role: "patient" });
      toast({ title: "Welcome!", description: "Account created successfully." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Registration failed", description: err.message });
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left Panel - Branding */}
      <div className="hidden md:flex flex-col justify-between bg-primary p-12 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2000&auto=format&fit=crop')] bg-cover opacity-20 mix-blend-overlay"></div>
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors">
             <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-display font-bold mb-4">MediCare Plus</h1>
          <p className="text-blue-100 text-lg max-w-md">Your gateway to premium healthcare services. Book appointments, manage reports, and consult top specialists.</p>
        </div>
        <div className="relative z-10 text-sm text-blue-200">
          © 2024 MediCare Plus. Secure & Private.
        </div>
      </div>

      {/* Right Panel - Forms */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="md:hidden mb-8">
            <Link href="/" className="text-muted-foreground hover:text-foreground flex items-center gap-2">
               <ArrowLeft className="w-4 h-4" /> Back Home
            </Link>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 h-12 p-1 bg-muted/50 rounded-xl">
              <TabsTrigger value="login" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Login</TabsTrigger>
              <TabsTrigger value="register" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card className="border-0 shadow-none">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
                  <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-username">Username</Label>
                      <Input 
                        id="login-username" 
                        placeholder="john_doe" 
                        value={username} 
                        onChange={e => setUsername(e.target.value)}
                        required
                        className="h-11 rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input 
                        id="login-password" 
                        type="password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)}
                        required
                        className="h-11 rounded-lg"
                      />
                    </div>
                    <Button type="submit" className="w-full h-11 rounded-lg text-base" disabled={isLoginPending}>
                      {isLoginPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Sign In
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card className="border-0 shadow-none">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                  <CardDescription>Join us to book appointments and view reports</CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-name">Full Name</Label>
                      <Input 
                        id="reg-name" 
                        placeholder="John Doe" 
                        value={name} 
                        onChange={e => setName(e.target.value)}
                        required
                        className="h-11 rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Email</Label>
                      <Input 
                        id="reg-email" 
                        type="email" 
                        placeholder="john@example.com" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)}
                        required
                        className="h-11 rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-username">Username</Label>
                      <Input 
                        id="reg-username" 
                        value={username} 
                        onChange={e => setUsername(e.target.value)}
                        required
                        className="h-11 rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Password</Label>
                      <Input 
                        id="reg-password" 
                        type="password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)}
                        required
                        className="h-11 rounded-lg"
                      />
                    </div>
                    <Button type="submit" className="w-full h-11 rounded-lg text-base" disabled={isRegisterPending}>
                      {isRegisterPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Create Account
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

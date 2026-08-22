import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import api from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await api.post("/login", { email, password });
    
    console.log("Resposta completa do login:", res.data);

    if (res.data.success) {
      const responseData = res.data.data || res.data; 

      const token = responseData.token;
      const user = responseData.user;

      if (token && user) {
        login(token, user);
        toast.success("Login realizado com sucesso!");
        navigate("/");   
      } else {
        toast.error("Resposta inválida do servidor");
      }
    } else {
      toast.error(res.data.message || "Erro ao fazer login");
    }
  } catch (err: any) {
    console.error("Erro completo:", err);
    const message = err?.response?.data?.message || "Email ou senha inválidos";
    toast.error(message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Barber Admin</CardTitle>
          <p className="text-muted-foreground">Entre na sua conta</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Não tem uma conta?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-primary hover:underline"
              >
                Criar conta
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
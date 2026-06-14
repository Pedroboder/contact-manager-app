import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, BookOpen, LogOut } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center space-y-6 max-w-md">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Contact Manager Pro</h1>
            <p className="text-muted-foreground mt-2">Gerencie seus contatos pessoais com elegancia e seguranca</p>
          </div>
          <a href={getLoginUrl()}>
            <Button size="lg" className="w-full">
              Fazer Login
            </Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Bem-vindo, {user?.name}!</h1>
            <p className="text-muted-foreground mt-2">Gerencie seus contatos de forma segura e organizada</p>
          </div>
          <Button variant="outline" size="sm" onClick={logout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation("/contacts")}>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Meus Contatos</h2>
                <p className="text-muted-foreground mt-1">Visualize, crie e gerencie todos os seus contatos pessoais</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

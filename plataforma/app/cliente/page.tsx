import { requireUser } from "../../lib/auth";
import { signOut, updateProfile } from "../actions";

export default async function ClientPage({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
  const { supabase, user } = await requireUser();
  const { data: profile, error } = await supabase.from("profiles")
    .select("full_name,phone,created_at").eq("user_id", user.id).single();
  const { estado } = await searchParams;
  return <div className="page"><span className="eyebrow">ÁREA PRIVADA · CLIENTE</span><h1>Seu espaço pessoal.</h1><p className="lead">Bem-vindo à área protegida de cadastro. Esta etapa não disponibiliza agenda, financeiro, prontuário ou informações de outros usuários.</p>
    {estado === "salvo" && <div className="status" role="status">Suas informações de perfil foram atualizadas.</div>}
    {estado === "invalidos" && <div className="status alert" role="alert">Dados inválidos. Verifique nome e telefone.</div>}
    {estado === "falha" && <div className="status alert" role="alert">Não foi possível salvar as alterações.</div>}
    {error && <div className="status alert" role="alert">Não foi possível consultar seu perfil. Verifique se a migração de banco de dados foi aplicada.</div>}
    <div className="card-grid">
      <section className="tile"><h2>Meus dados</h2><p><strong>E-mail autenticado:</strong> {user.email}</p><form action={updateProfile}><div className="field"><label htmlFor="nome">Nome completo</label><input id="nome" name="nome" required minLength={2} maxLength={90} defaultValue={profile?.full_name ?? ""}/></div><div className="field"><label htmlFor="telefone">Telefone (opcional)</label><input id="telefone" name="telefone" type="tel" maxLength={24} defaultValue={profile?.phone ?? ""}/></div><button className="btn" type="submit">Salvar alterações</button></form></section>
      <section className="tile"><h2>Próximos serviços</h2><p>As funcionalidades de solicitação de agendamento e consulta de pagamentos ainda não foram ativadas.</p><p>Nenhum dado de outro cliente está disponível nesta interface.</p><form action={signOut}><button className="btn btn-secondary" type="submit">Sair da conta</button></form></section>
    </div>
  </div>;
}

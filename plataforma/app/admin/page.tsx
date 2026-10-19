import { requireAdmin } from "../../lib/auth";
import { signOut } from "../actions";
export default async function Admin() {
  const { user } = await requireAdmin();
  return <div className="page"><span className="eyebrow">ACESSO ADMINISTRATIVO · MFA VALIDADO</span><h1>Área reservada da profissional.</h1><p className="lead">Acesso autorizado para {user.email}. A autenticação com segundo fator foi verificada. Os módulos de clientes, agendamentos e financeiro pertencem às etapas seguintes e ainda não estão ativos.</p>
    <div className="card-grid">
      <div className="tile"><h2>Proteção em funcionamento</h2><p>Autenticação Supabase, papel administrativo concedido exclusivamente pelo banco e exigência de AAL2.</p></div>
      <div className="tile"><h2>Sem métricas fictícias</h2><p>Nenhum dado clínico, transacional ou estatístico foi criado. Os indicadores aparecerão apenas após implementação e integração real.</p></div>
    </div><div className="actions"><form action={signOut}><button type="submit" className="btn">Encerrar sessão</button></form></div>
  </div>;
}

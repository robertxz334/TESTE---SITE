import { requireUser } from "../../lib/auth";
import { updatePassword } from "../actions";
export default async function Reset({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
  await requireUser();
  const { estado } = await searchParams;
  return <section className="auth-card"><span className="eyebrow">ATUALIZAÇÃO DE CREDENCIAIS</span><h1>Definir nova senha.</h1>
    {estado && <p className="status alert" role="alert">{estado === "invalidos" ? "Use uma senha de pelo menos 12 caracteres e confirme-a corretamente." : "Não foi possível atualizar a senha."}</p>}
    <form action={updatePassword}><div className="field"><label htmlFor="senha">Nova senha</label><input id="senha" name="senha" type="password" autoComplete="new-password" required minLength={12} maxLength={128}/></div><div className="field"><label htmlFor="confirmar">Confirmar nova senha</label><input id="confirmar" name="confirmar" type="password" autoComplete="new-password" required minLength={12} maxLength={128}/></div><button className="btn" type="submit">Atualizar senha</button></form>
  </section>;
}

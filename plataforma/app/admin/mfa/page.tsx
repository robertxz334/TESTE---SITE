import { redirect } from "next/navigation";
import { getRole, requireUser } from "../../../lib/auth";
import MfaSetup from "./mfa-setup";
export default async function MfaPage() {
  const { supabase, user } = await requireUser();
  if ((await getRole(supabase, user.id)) !== "admin") redirect("/cliente");
  const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (!error && data.currentLevel === "aal2") redirect("/admin");
  return <div className="page"><span className="eyebrow">PROTEÇÃO OBRIGATÓRIA</span><h1>Verificação em duas etapas.</h1><p className="lead">O painel da psicóloga exige um código de autenticador (TOTP) além da senha.</p><MfaSetup /></div>;
}

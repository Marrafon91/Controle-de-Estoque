const DIAS_ALERTA_VALIDADE = 7; // configurável — período padrão de aviso

export function diasParaVencer(dataValidade: string | null): number | null {
  if (!dataValidade) return null;
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const validade = new Date(dataValidade + 'T00:00:00');
  const diffMs = validade.getTime() - hoje.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function precisaAlertarValidade(dataValidade: string | null): boolean {
  const dias = diasParaVencer(dataValidade);
  return dias !== null && dias <= DIAS_ALERTA_VALIDADE;
}

# Proveniencia do payload

Este repositorio e a distribuicao **lite e autocontida** do sistema de agentes
Hermes + OpenSpec. Nao depende de nenhum repo privado, URL ou rede.

## De onde veio

O payload foi curado e sanitizado a partir de um repositorio privado maior
(nao distribuido).. Este repo contem **apenas** a versao
limpa e minima. A versao completa nao e publicada aqui.

## Como o payload foi montado

- **Curadoria por MOC, nao por uso.** 12 decision-card MOCs guiam a selecao por
  cobertura de area. Ranking de `use_count` foi rejeitado: a distribuicao era
  enviesada para video/cinema.
- **Sanitizacao sob medida.** Nome de cliente, nome de projeto, path de dono e
  inventario de maquina foram removidos ou trocados por placeholder. Aprendizado
  preservado; dado pessoal nao.
- **Auditoria automatica.** Ver `rules/audit-rules.yaml` +
  `hooks/bnf-lite-audit.sh`. O gate roda em pre-commit e foi testado contra git
  real (casos positivo e negativo).

## O que NAO esta aqui

- Wrappers de agente externo (`codex`, `claude-code`, `opencode`): delegam para
  outro coding agent; o fluxo assume que voce ja esta no OpenCode.
- Dados de cliente, campanhas, credenciais e paths de maquina.
- A versao completa do sistema.

## Upgrade

O upgrade para a versao completa e um passo separado e NAO faz parte do install
lite. Ver secao "Upgrade" do `README.md`.

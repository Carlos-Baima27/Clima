# Tarefas de Implementação

Este arquivo divide a implementação descrita no [prd.md](./prd.md) em tarefas menores e progressivas. Cada agente deve executar uma tarefa por vez, marcar a caixa somente depois de validar o critério de aprovação e preservar as decisões já tomadas nas tarefas anteriores.

## Regras de execução

- [ ] Antes de começar, ler o [prd.md](./prd.md) e as tarefas anteriores já concluídas.
- [ ] Alterar somente o escopo da tarefa atual, salvo ajustes diretamente necessários para fazê-la funcionar.
- [ ] Executar o critério de aprovação da tarefa antes de marcá-la como concluída.
- [ ] Não duplicar neste arquivo regras ou detalhes já descritos no [prd.md](./prd.md); usar suas seções como referência.

## Sequência de tarefas

### 1. Mapear o template inicial e preparar a estrutura

- [x] Inspecionar os arquivos existentes em `src/` e identificar o ponto de entrada, estilos e template inicial do Vite.
- [x] Criar, se necessário, as pastas e módulos previstos para serviços, utilitários e tipos, sem implementar ainda a integração completa.
- [x] Manter os scripts e a configuração existentes compatíveis com Vite e TypeScript.

**Critério de aprovação:** a estrutura do projeto corresponde à separação proposta no PRD, os imports não apontam para arquivos inexistentes e `npm run build` termina sem erros.

### 2. Definir os tipos de domínio do clima

- [x] Criar os tipos necessários para resultado de geocodificação, resposta climática, dados atuais e estado consumido pela UI.
- [x] Representar os campos obrigatórios e os possíveis valores ausentes conforme o tratamento de dados do PRD.
- [x] Usar os tipos nos módulos que forem criados posteriormente, evitando `any` para respostas da API.

**Critério de aprovação:** os tipos descrevem todos os dados exigidos pelo PRD e `npm run build` passa com `noImplicitAny` respeitado, sem introduzir `any` nas novas interfaces de API.

### 3. Implementar o serviço de geocodificação

- [x] Criar uma função dedicada para consultar o endpoint de busca de cidades da OpenMeteo.
- [x] Validar o nome recebido antes da requisição e tratar campo vazio, falha de rede, resposta inválida e ausência de resultados.
- [x] Retornar somente os dados necessários para a próxima etapa: nome, latitude, longitude, código do país e timezone.

**Critério de aprovação:** uma chamada válida retorna um resultado tipado; entrada vazia, resposta sem resultados, resposta inválida ou erro de rede retornam o estado de ausência definido pelo serviço sem lançar erro não tratado.

### 4. Implementar o serviço de clima

- [x] Criar uma função dedicada para consultar o endpoint de previsão com latitude, longitude e timezone.
- [x] Validar os parâmetros antes da requisição e tratar falha de rede, resposta inválida e ausência de dados atuais.
- [x] Extrair os campos climáticos obrigatórios e suas unidades, conforme o PRD.

**Critério de aprovação:** com parâmetros válidos, o serviço retorna os dados atuais necessários; com qualquer parâmetro ausente ou resposta incompleta, retorna ausência de dados sem quebrar a aplicação.

### 5. Criar o fluxo único de consulta

- [ ] Compor os serviços de geocodificação e clima em uma operação única para a UI.
- [ ] Interromper o fluxo quando a cidade não for encontrada ou quando os dados climáticos estiverem indisponíveis.
- [ ] Garantir que falhas das duas etapas resultem em um estado consistente de ausência, sem requisições com parâmetros inválidos.

**Critério de aprovação:** uma busca válida executa as duas etapas na ordem correta e produz um modelo pronto para renderização; qualquer falha produz o mesmo resultado de ausência e não deixa dados parciais.

### 6. Implementar utilitários de interpretação e formatação

- [ ] Mapear os códigos WMO previstos no PRD para descrições legíveis em português, incluindo códigos não listados como fallback.
- [ ] Criar formatadores para temperatura, umidade, precipitação, vento, direção e data no timezone da cidade.
- [ ] Converter o indicador `is_day` para o texto de dia ou noite.

**Critério de aprovação:** cada código WMO definido no PRD retorna uma descrição em português; valores climáticos são exibidos com unidades corretas e uma data válida é formatada usando o timezone recebido.

### 7. Substituir o template pela estrutura da aplicação

- [ ] Atualizar o HTML gerado por `main.ts` para conter busca, estado vazio, loading, sidebar e área principal.
- [ ] Usar elementos semânticos e identificadores estáveis para que a camada de renderização atualize o conteúdo sem recriar a aplicação inteira.
- [ ] Manter textos de fallback claros e compatíveis com os estados descritos no PRD.

**Critério de aprovação:** ao abrir a aplicação, o usuário encontra o campo de cidade e um estado inicial válido; a estrutura contém todos os pontos de renderização necessários e não exibe o template padrão do Vite.

### 8. Implementar estado e renderização da UI

- [ ] Criar o estado local para busca, loading, sucesso e ausência/erro.
- [ ] Renderizar na sidebar o nome, país, temperatura, data, período e descrição do tempo.
- [ ] Renderizar na área principal umidade, sensação térmica, precipitação e vento com suas unidades.
- [ ] Remover resultados antigos ao iniciar uma nova busca ou ao receber ausência de dados.

**Critério de aprovação:** dados mockados de sucesso preenchem todos os campos obrigatórios; loading, estado vazio e resultado não aparecem simultaneamente; uma nova busca substitui o resultado anterior corretamente.

### 9. Conectar e validar o formulário de busca

- [ ] Submeter a busca por ação única do usuário, incluindo envio pelo teclado.
- [ ] Impedir consulta para entrada vazia ou composta apenas por espaços.
- [ ] Desabilitar ou proteger a ação enquanto a busca estiver em andamento e restaurar o formulário ao finalizar.
- [ ] Tratar erros do fluxo de consulta exibindo o estado vazio sem erro não tratado no console.

**Critério de aprovação:** uma busca válida exibe loading e depois sucesso; entrada vazia não chama a API; durante loading não há buscas concorrentes pela mesma ação; falhas retornam ao estado vazio e permitem nova tentativa.

### 10. Aplicar o layout visual e a responsividade

- [ ] Implementar o fundo escuro, o contêiner claro centralizado e a composição em sidebar mais área principal conforme o PRD.
- [ ] Estilizar busca, loading, estado vazio, dados e unidades com contraste e hierarquia legíveis.
- [ ] Fazer o conteúdo empilhar de forma utilizável em telas menores, sem sobreposição nem overflow horizontal.

**Critério de aprovação:** em viewport desktop o resultado apresenta duas colunas dentro do contêiner arredondado; em viewport mobile os blocos ficam legíveis e empilhados, sem conteúdo cortado ou sobreposto.

### 11. Verificar integração e critérios de aceitação

- [ ] Testar manualmente busca válida, cidade inexistente, clima indisponível, campo vazio e falha de rede.
- [ ] Confirmar que as requisições usam os endpoints, parâmetros e timezone definidos no PRD.
- [ ] Executar o build de produção e revisar os critérios de aceitação do PRD, corrigindo apenas falhas relacionadas ao escopo.

**Critério de aprovação:** todos os casos de uso do PRD têm comportamento observável correto, os dados obrigatórios são exibidos, a aplicação mantém a UI utilizável após falhas e `npm run build` passa sem erros.

## Conclusão

- [ ] Todas as tarefas anteriores estão marcadas e seus critérios de aprovação foram verificados.
- [ ] A implementação final atende aos critérios de aceitação da seção 11 do [prd.md](./prd.md).

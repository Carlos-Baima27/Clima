# PRD - Clima

## 1. Visão geral

Este projeto é uma aplicação web de consulta de clima por cidade, desenvolvida com Vite + TypeScript + Vanilla JavaScript. O objetivo principal é permitir que o usuário informe o nome de uma cidade e receba rapidamente as informações climáticas mais relevantes daquela localização.

A aplicação consulta a API OpenMeteo em duas etapas:

1. Busca geográfica da cidade para obter latitude, longitude e timezone.
2. Busca do clima usando esses dados para exibir temperatura, umidade, sensação térmica, precipitação e vento.

O produto deve apresentar uma experiência simples, limpa e focada em uma busca única, com carregamento, estados vazios e resultado visual organizado.

---

## 2. Objetivo do produto

Permitir ao usuário:

- inserir o nome de uma cidade;
- consultar automaticamente os dados climáticos dessa localização;
- visualizar as principais informações climáticas em uma interface amigável;
- receber feedback claro quando a cidade não for encontrada ou não houver dados disponíveis.

### Objetivo principal

Entregar uma interface minimalista e funcional para consulta de clima em tempo real, com foco em legibilidade, rapidez e confiabilidade da informação.

---

## 3. Público-alvo

- Usuários que desejam consultar rapidamente o clima de uma cidade.
- Usuários que acessam a aplicação em desktop ou mobile.
- Usuários que preferem uma interface enxuta, sem excessos visuais.

---

## 4. Escopo funcional

### 4.1 Fluxo principal

1. O usuário acessa a tela inicial.
2. Visualiza um campo de busca centralizado no topo.
3. Digita o nome da cidade.
4. A aplicação inicia uma busca única com estado de loading.
5. O sistema faz a consulta de geolocalização da cidade.
6. Se a cidade for localizada, o sistema consulta o clima com base em latitude, longitude e timezone.
7. A página renderiza os dados do clima em um layout com sidebar e área principal.
8. Se não encontrar a cidade ou clima, mostra um estado vazio.

### 4.2 Funcionalidades obrigatórias

- Busca por nome da cidade.
- Validação básica do valor digitado.
- Loading durante a busca.
- Estado vazio quando não há resultado.
- Exibição de dados da cidade: nome, país e timezone.
- Exibição do clima atual: temperatura, umidade, sensação térmica, probabilidade de precipitação, velocidade e direção do vento, e código meteorológico.
- Interpretação do weather code em texto legível.
- Exibição do dia atual e do período (dia/noite) com base em is_day.

### 4.3 Casos de uso

#### Caso 1: Cidade encontrada

- Usuário digita um nome válido.
- Sistema encontra latitude, longitude e timezone.
- Sistema busca o clima.
- Tela mostra os dados corretamente.

#### Caso 2: Cidade não encontrada

- Usuário digita algo sem correspondência.
- Sistema retorna ausência de resultado.
- Tela mostra Empty State.

#### Caso 3: Geocodificação encontrada mas clima indisponível

- Sistema trata a ausência de dados climáticos como ausência de resultado.
- Tela mostra o mesmo Empty State.

#### Caso 4: Campo vazio

- Usuário envia busca sem preencher o campo.
- Sistema impede a execução da busca e mantém o estado consistente.

---

## 5. Requisitos funcionais

### RF-01 - Campo de busca

O sistema deve conter um campo de texto para inserir o nome da cidade.

### RF-02 - Ação de busca

Ao enviar a busca, o sistema deve iniciar a fluxo de consulta em uma única ação do usuário.

### RF-03 - Consulta de geocodificação

O sistema deve consultar o endpoint de busca de cidade da OpenMeteo com o nome digitado.

### RF-04 - Validação de dados

A aplicação deve verificar se os parâmetros necessários vieram corretamente; em caso contrário, deve tratar como resultado inexistente.

### RF-05 - Consulta de clima

Se a cidade for encontrada, o sistema deve consultar a API de previsão climática usando latitude, longitude e timezone.

### RF-06 - Tratamento de ausência de dados

Se a geocodificação não devolver resultados, ou se o clima não existir para o local, o sistema deve exibir estado vazio em vez de quebrar a interface.

### RF-07 - Loading

Durante a busca, a interface deve sinalizar carregamento para indicar processamento.

### RF-08 - Visualização do clima

A aplicação deve exibir os seguintes dados:

- temperatura;
- nome da cidade;
- código do país;
- dia atual;
- indicação se é dia ou noite;
- weather code;
- umidade relativa;
- temperatura aparente;
- probabilidade de precipitação;
- velocidade do vento;
- direção do vento.

### RF-09 - Interpretação do weather code

O sistema deve converter o código meteorológico em uma descrição legível, seguindo a tabela de interpretação WMO.

### RF-10 - Estado vazio

Quando não houver resultado, a interface deve exibir uma mensagem clara, sem elementos quebrados.

### RF-11 - Responsividade

A interface deve manter a composição legível em desktop e telas menores.

---

## 6. Requisitos não funcionais

### RNF-01 - Performance

A busca deve responder de forma rápida e clara, sem travamentos perceptíveis.

### RNF-02 - Robustez

A aplicação deve tratar falhas de rede, respostas incompletas e parâmetros vazios sem quebrar a UI.

### RNF-03 - Manutenibilidade

A lógica de integração com a API deve ser isolada em módulo específico, separado da camada de apresentação.

### RNF-04 - Simplicidade de uso

O fluxo deve ser intuitivo, com um único campo de entrada e resultado direto.

### RNF-05 - UX clara

Os estados de carregamento, erro e vazio devem ser reconhecíveis e consistentes.

---

## 7. Requisitos de sistema

### 7.1 Stack tecnológica

- Vite
- TypeScript
- Vanilla JavaScript / DOM nativo
- CSS
- API OpenMeteo

### 7.2 Arquitetura proposta

A aplicação deve seguir uma separação simples em camadas:

- UI / rendering: manipulação do DOM e atualização do layout
- Serviços: funções para comunicação com OpenMeteo
- Utilitários: parsing, formatação, mapeamento de weather code
- Estado local: objeto de dados do clima e flags de loading/empty/error

### 7.3 Estrutura sugerida

```text
src/
  main.ts
  style.css
  services/
    openMeteo.ts
  utils/
    weather.ts
    formatters.ts
  types/
    weather.ts
```

### 7.4 Arquivos do projeto

O projeto já possui estrutura mínima do Vite. A implementação do produto deve substituir o template inicial e criar a lógica real do app.

---

## 8. Detalhes técnicos

### 8.1 Endpoints da API

#### 1) Busca por cidade

Endpoint:

```text
https://geocoding-api.open-meteo.com/v1/search?name={NOME_DA_CIDADE}&count=1&language=pt&format=json
```

Campos necessários retornados:

- name
- latitude
- longitude
- country_code
- timezone

#### 2) Busca por clima

Endpoint:

```text
https://api.open-meteo.com/v1/forecast?latitude={LATITUDE}&longitude={LONGITUDE}&current=precipitation_probability,temperature_2m,relative_humidity_2m,apparent_temperature,is_day,wind_speed_10m,wind_direction_10m,precipitation,weather_code&timezone={TIMEZONE}
```

Campos obrigatórios da resposta:

- temperature_2m
- relative_humidity_2m
- apparent_temperature
- is_day
- wind_speed_10m
- wind_direction_10m
- precipitation_probability

### 8.2 Regras de integração

- A busca deve ocorrer por duas requisições encapsuladas em funções dedicadas.
- Os parâmetros devem ser validados antes da chamada.
- Se houver falha ou ausência de dados, a função deve retornar null, undefined ou um objeto de falha padronizado.
- A camada de UI deve tratar todos os casos de falha de forma consistente.

### 8.3 Mapeamento do Weather Code

A aplicação deve mapear os códigos WMO para texto em português. Exemplo:

- 0: Clear sky
- 1, 2, 3: Mainly clear, partly cloudy, and overcast
- 45, 48: Fog and depositing rime fog
- 51, 53, 55: Drizzle
- 61, 63, 65: Rain
- 71, 73, 75: Snow fall
- 80, 81, 82: Rain showers
- 95, 96, 99: Thunderstorm

A interpretação pode ser feita por uma tabela estática em TypeScript ou por um utilitário que converte o código em descrição amigável e curta.

### 8.4 Formatação

- temperatura: exibir em °C
- umidade: exibir em %
- precipitação: exibir em %
- vento: exibir velocidade em km/h e direção em graus
- data: exibir no formato local do usuário ou do timezone da cidade

### 8.5 Tratamento de erros

A aplicação deve lidar com:

- campo vazio;
- cidade não encontrada;
- requisição de geocodificação sem resposta;
- problema de rede;
- clima indisponível;
- dados incompletos.

Em todos esses casos, devem ser exibidos estados de fallback sem quebrar a aplicação.

---

## 9. Instruções visuais e UX

### 9.1 Layout geral

- Fundo geral: cinza escuro.
- O conteúdo principal deve ficar centralizado.
- O contêiner principal tem borda bem arredondada, fundo branco e largura máxima de 800px.
- A parte superior deve conter apenas o campo de busca da cidade.
- A parte inferior deverá ter duas colunas: sidebar à esquerda e área principal à direita.

### 9.2 Estrutura visual

#### Topo

- Campo de busca centralizado.
- Placeholder sugerido: "Digite a cidade"
- Botão opcional de busca, se implementado.

#### Sidebar (esquerda)

Itens obrigatórios:

- Temperatura principal
- Nome da cidade
- Código do país
- Dia atual
- Status: dia/noite
- Weather code / descrição

#### Área principal (direita)

Itens obrigatórios:

- Umidade relativa
- Temperatura aparente
- Probabilidade de precipitação
- Velocidade do vento
- Direção do vento

### 9.3 Estado vazio (Empty State)

- Exibir mensagem simples como: "Nenhuma cidade encontrada" ou "Não foi possível carregar o clima desta localização."
- Deve ser visualmente limpo e centralizado.
- Não deve deixar o layout quebrado.
- Idealmente deve manter o mesmo contêiner visual do resultado, apenas com conteúdo vazio.

### 9.4 Estilo visual recomendado

- Cores: neutros com contraste clean;
- Tipografia clara e sem excesso de peso;
- Bordas arredondadas suaves;
- Espaçamento consistente;
- Sem background forte no topo; a organização deve ser clara e elegante.

### 9.5 Responsividade

Em telas menores:

- o layout deve empilhar os blocos de forma legível;
- a sidebar pode ficar acima da área principal ou seguir uma estrutura condensa;
- o campo de busca continua centralizado e com boa proporção.

---

## 10. Regras de comportamento da interface

### 10.1 Carregamento

Durante a procura, a aplicação deve exibir algum feedback visual, como:

- texto "Buscando clima..."
- botão desabilitado
- spinner leve

### 10.2 Resultado com sucesso

Quando a busca for bem-sucedida:

- a tela deve remover o estado vazio;
- atualizar a sidebar e a área principal;
- manter a estrutura do layout estável.

### 10.3 Resultado sem sucesso

Quando a busca for falha:

- remover o conteúdo antigo se necessário;
- exibir apenas o Empty State;
- manter o campo de busca disponível para nova tentativa.

---

## 11. Critérios de aceitação

1. Usuário consegue buscar uma cidade pelo nome.
2. O sistema realiza as duas requisições necessárias para obter lat/long/timezone e clima.
3. Se a cidade não existe, o sistema exibe Empty State.
4. Se a geocodificação funciona mas o clima não existe, o sistema também exibe Empty State.
5. O carregamento é exibido durante a busca.
6. Os dados mais relevantes do clima são exibidos na interface.
7. O layout respeita o visual proposto: fundo escuro, contêiner branco com borda arredondada, busca centralizada, sidebar e conteúdo principal.
8. A interface é funcional em telas de desktop e mobile.
9. O weather code é interpretado em texto humano.
10. A lógica de API está isolada em um módulo dedicado, sem acoplamento direto à camada visual.

---

## 12. Observações finais

Este PRD define a base do produto, com foco em uma solução simples, clara e confiável. A implementação deve priorizar:

- consistência de dados;
- tratamento de falhas;
- experiência enxuta;
- layout visual proposto; e
- separação lógica entre acesso a API e renderização da tela.

A aplicação deve ser tratada como uma ferramenta de consulta rápida, não como dashboard complexo, mantendo o foco em legibilidade e utilidade imediata.

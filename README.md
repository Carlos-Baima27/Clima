# Clima agora

Aplicação web para consultar o clima atual de uma cidade usando a API Open-Meteo. O projeto apresenta temperatura, umidade, sensação térmica, precipitação, vento, código meteorológico e indicação de dia ou noite em uma interface responsiva.

## Demonstração

Acesse: [Clima agora no GitHub Pages](https://carlos-baima27.github.io/Clima/)

## Funcionalidades

- Busca de cidades por nome.
- Consulta de geolocalização e clima atual.
- Exibição de temperatura, umidade, sensação térmica e precipitação.
- Velocidade e direção do vento.
- Descrição do clima baseada nos códigos WMO.
- Ícone de sol ou lua conforme o período local.
- Skeleton loading durante as requisições.
- Estados vazio e de fallback para falhas ou cidades não encontradas.
- Layout responsivo para desktop e dispositivos móveis.

## Tecnologias

- Vite
- TypeScript
- JavaScript nativo e DOM
- CSS
- Open-Meteo Geocoding API
- Open-Meteo Forecast API
- GitHub Actions
- GitHub Pages

## Executando localmente

Pré-requisitos: Node.js e npm instalados.

```bash
npm install
npm run dev
```

A aplicação ficará disponível no endereço informado pelo Vite, normalmente `http://localhost:5173`.

## Scripts

```bash
npm run dev      # inicia o servidor de desenvolvimento
npm run build    # verifica os tipos e gera o build de produção
npm run preview  # executa uma prévia do build
```

## Estrutura principal

```text
src/
  main.ts                  # estrutura, estado e renderização da UI
  style.css                # layout e estilos responsivos
  services/openMeteo.ts    # integração com a API Open-Meteo
  types/weather.ts         # tipos do domínio climático
  utils/weather.ts         # códigos WMO e período do dia
  utils/formatters.ts      # formatação de dados

.github/workflows/
  deploy.yml               # build e deploy automático no GitHub Pages
```

## Deploy

O workflow em `.github/workflows/deploy.yml` é executado automaticamente a cada `push` na branch `main`. Ele instala as dependências, executa `npm run build` e publica a pasta `dist` no GitHub Pages.

Para habilitar o deploy no repositório:

1. Acesse **Settings > Pages**.
2. Em **Source**, selecione **GitHub Actions**.
3. Faça push das alterações para a branch `main`.

O caminho base do Vite está configurado para o nome do repositório em `vite.config.ts`:

```ts
base: "/Clima/";
```

## API

O projeto utiliza os seguintes endpoints públicos:

- Geocodificação: `https://geocoding-api.open-meteo.com/v1/search`
- Previsão: `https://api.open-meteo.com/v1/forecast`

Nenhuma chave de API é necessária.

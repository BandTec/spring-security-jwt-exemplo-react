# JWT com React, Vite e Axios

Este projeto demonstra, de ponta a ponta, como autenticar com JWT em uma aplicação React (Vite), armazenar o token no `sessionStorage`, configurar uma instância do `axios` com `interceptors` e consumir endpoints protegidos.
---

## Visão Geral

- **Stack**: React 18 + Vite + React Router
- **Autenticação**: JWT emitido pela API e enviado pelo cliente via header `Authorization: Bearer <token>`
- **Armazenamento do Token**: `sessionStorage` (limpa quando a aba/guia é fechada)
- **Configuração de API**: Instância do `axios` com `interceptor` de request para anexar o token
- **Rotas**: `Login` e `Welcome`

Arquivos-chave:
- `src/provider/api.js` – configuração do axios e interceptor
- `src/pages/login/Login.jsx` – fluxo de login e persistência do token
- `src/pages/welcome/WelcomePage.jsx` – logout e leitura de dados do usuário
- `.env` – variável `VITE_ENDERECO_API` com a URL base da API

---

## JWT em poucas palavras

- **O que é**: JSON Web Token é um token (string) assinado, que carrega claims (informações) e comprova a autenticação.
- **Como é usado aqui**: Após login bem-sucedido, a API retorna um `token`. O frontend armazena esse token e o envia nas próximas requisições via header HTTP.
- **Validade**: Tokens costumam expirar. Quando expiram, a API retorna (tipicamente) 401. A aplicação deve tratar esse caso (ex.: redirecionar para login/renovar token).

---

## Variáveis de Ambiente (Vite)

Crie um arquivo `.env` na raiz do projeto para configurar a URL base da API:

```env
VITE_ENDERECO_API=http://localhost:8080/usuarios
```

- No código, acesse via `import.meta.env.VITE_ENDERECO_API`.
- Em Vite, apenas variáveis prefixadas com `VITE_` ficam disponíveis no frontend.

---

## Axios e Interceptors

### O que é Axios
- **Axios** é um cliente HTTP que simplifica chamadas à API (GET/POST/PUT/DELETE, interceptors, instâncias, cancelamento, etc.).

### Interceptors
- **Interceptors de request** permitem alterar a requisição antes de ela sair (ex.: anexar headers). 

### Como está configurado neste projeto

`src/provider/api.js`:
```1:15:src/provider/api.js
import axios from "axios";

// Criando uma instância do axios com a URL base da API
const api = axios.create({
  baseURL: import.meta.env.VITE_ENDERECO_API, // http://localhost:8080/usuarios
})

// Adiciona o token JWT em todas as requisições
api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

- A URL base vem de `VITE_ENDERECO_API`.
- Antes de cada request, se existir `authToken` no `sessionStorage`, o header `Authorization` é adicionado automaticamente.


## Fluxo de Login e Armazenamento do Token

`src/pages/login/Login.jsx` realiza:
- Chamada `POST` para `/usuarios/login` com `{ email, senha }`.
- Ao receber `response.data.token`, salva `sessionStorage.setItem('authToken', token)`.
- Mostra um toast de sucesso e navega para `/welcome`.

Trecho relevante:
```14:34:src/pages/login/Login.jsx
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/usuarios/login', {
        email: username,
        senha: password
      });
      if (response.status === 200 && response.data?.token) {

        sessionStorage.setItem('authToken', response.data.token);

        setToast({
          mensagem: 'Login realizado com sucesso!',
          tipo: 'sucesso'
        });

        setTimeout(() => {
          navigate('/welcome');
        }, 1000);
      } else {
        throw new Error('Ops! Ocorreu um erro interno.');
      }
    } catch (error) {
      setToast({
        mensagem: error.message11 || 'Ops! Ocorreu um erro interno.',
        tipo: 'erro'
      });
    }
  };
```

Observações didáticas:
- `sessionStorage` mantém dados por aba/guia. Fechar a aba limpa o token. Se quiser persistência entre abas/fechamentos do navegador, use `localStorage` (com mais cuidado).
- O código exibe toasts para feedback ao usuário.

---

## Consumo de Endpoints Protegidos

Após o login, qualquer chamada feita via `api` (instância do axios) incluirá automaticamente `Authorization: Bearer <token>` por causa do interceptor. Exemplo:

```javascript
import { api } from '../provider/api';

async function buscarDadosProtegidos() {
  const { data } = await api.get('/usuarios/dados');
  return data;
}
```

> Como a URL base já está em `VITE_ENDERECO_API`, use caminhos relativos a partir dela.

---

## Logout

`src/pages/welcome/WelcomePage.jsx` remove o token e redireciona para a página de login:
```9:13:src/pages/welcome/WelcomePage.jsx
    const handleLogout = () => {
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('usuario');
        navigate('/');
    };
```

- Após o logout, chamadas subsequentes não terão mais o header `Authorization`.


## Como rodar o projeto

1. Instale dependências:
```bash
npm install
```
2. Crie `.env` na raiz com a URL da API:
```env
VITE_ENDERECO_API=http://localhost:8080/usuarios
```
3. Rode o app:
```bash
npm run dev
```
4. Acesse a rota raiz `/` para a tela de login.


## Referências

- Documentação JWT: `https://jwt.io/`
- Axios: `https://axios-http.com/`
- React Router: `https://reactrouter.com/`
- Vite (Env Vars): `https://vitejs.dev/guide/env-and-mode.html`
- API de exemplo (Spring Security + JWT): `https://github.com/BandTec/spring-security-jwt-exemplo`
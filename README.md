# Exemplo de consumo de Token JWT com React e Vite

Neste repositório, demonstraremos como uma aplicação React configurada com Vite pode consumir e armazenar um token JWT no `sessionStorage` e, também, como efetuar o logout removendo o token e redirecionando o usuário de volta para a página inicial.

## Pré-requisitos

- Ter o [Node.js](https://nodejs.org/) instalado.
- Uma API que retorne um token JWT. Para fins de demonstração, estamos usando a API fornecida [aqui](https://github.com/BandTec/spring-security-jwt-exemplo).
- Criar um arquivo `.env` na raiz do projeto contendo a url da api. exemplo caso estiver rodando a API local: `VITE_ENDERECO_API = http://localhost:8080/usuarios`

### 📚 Swagger UI
Para uma interação visual e direta com a API, acesse a interface do Swagger UI:

- **Swagger UI:** `localhost:8080/swagger-ui/index.html`

Através dela, você pode facilmente testar os endpoints disponíveis, compreendendo o fluxo de autenticação e autorização.

## Passos

1. **Obtendo e Armazenando o Token JWT no `sessionStorage`:**

   Uma vez que você tenha obtido o token JWT da sua API, armazene-o no `sessionStorage` da seguinte maneira:

   ```javascript
   // Suponhamos que este seja o token JWT obtido
   const token = 'seu_jwt_token_aqui';

   // Armazene no sessionStorage
   sessionStorage.setItem('authToken', token);
   ```

2. **Acessando o Token JWT para Consumo:**

   Sempre que você precisar acessar o token JWT para fazer requisições autenticadas à sua API, você pode obtê-lo da seguinte forma:

   ```javascript
   const token = sessionStorage.getItem('authToken');
   ```

3. **Realizando o Logout:**

   Quando um usuário decide fazer logout, você pode simplesmente remover o token do `sessionStorage` e redirecionar o usuário para a página inicial:

   ```javascript
   // Remova o token
   sessionStorage.removeItem('authToken');

   // Redirecione para a página inicial (isto é apenas um exemplo, pode variar dependendo da sua configuração de roteamento)
   navigate('/');
   ```

## Testando

Agora que você está familiarizado com os conceitos básicos, sinta-se à vontade para clonar e testar a API mencionada acima para ver tudo em ação!

API de referência: [https://github.com/BandTec/spring-security-jwt-exemplo](https://github.com/BandTec/spring-security-jwt-exemplo)

Basta clonar e testar 😉

---

Espero que este guia ajude você a entender o processo de consumo, armazenamento e remoção de tokens JWT em uma aplicação React com Vite. Se você tiver alguma dúvida ou feedback, sinta-se à vontade para abrir uma issue ou enviar um pull request!
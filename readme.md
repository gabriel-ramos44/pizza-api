# Pizzaria API

Bem-vindo à API de gerenciamento de pedidos da Pizzaria. Esta API permite que os clientes montem pedidos de pizzas, incluindo tamanhos, sabores e personalizações, e obtenham detalhes como preço final e tempo de preparo.

## Índice

- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Endpoints](#endpoints)
- [Documentação da API](#documentação-da-api)

## Instalação

Para instalar e executar esta API localmente, siga os passos abaixo:

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/pizzaria-api.git
   ```

1. Navegue até o diretório do projeto:
   ```bash
   cd pizzaria-api
   ```
2. Navegue até o diretório do projeto:
   ```bash
   npm install
   ```
## Configuração
Certifique-se de ter uma instância do MongoDB em execução e configurar a conexão com o banco de dados no arquivo .env:
   ```bash
MONGO_URI=mongodb://localhost:27017/pizzaria
PORT=3000

   ```

## Uso
Para iniciar o servidor, execute:
   ```bash
   npm start
   ```
## Endopoints
###  Criar Pedido

URL: /orders

Método: POST

Descrição: Cria um novo pedido de pizza.

Corpo da Requisição:
   ```json
   {
  "pizzas": [
    {
      "size": "Média",
      "flavor": "Calabresa",
      "customizations": ["Extra bacon", "Borda recheada"]
    }
  ]
}
   ```
 Respostas:

    201 Created: Pedido criado com sucesso.
    400 Bad Request: Erro na validação dos dados.
    500 Internal Server Error: Erro interno no servidor.

### Obter Detalhes do Pedido

URL: /orders/{orderId}

Método: GET

Descrição: Obtém os detalhes de um pedido específico.

Parâmetros de URL

     orderId (string): ID do pedido.

    Respostas:
        200 OK: Detalhes do pedido retornados com sucesso.
        404 Not Found: Pedido não encontrado.
        500 Internal Server Error: Erro interno no servidor.

## Documentação da API
A documentação completa da API está disponível via Swagger. Após iniciar o servidor, acesse:
http://localhost:3000/api-docs
# Backend de Exemplo - BarberApp

Este é um backend de exemplo para testar a integração com o frontend da barbearia.

## 🚀 Como executar

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente (opcional)
Crie um arquivo `.env` na raiz do projeto:
```env
PORT=3333
JWT_SECRET=your-secret-key-here
```

### 3. Executar o servidor
```bash
# Desenvolvimento (com auto-reload)
npm run dev

# Produção
npm start
```

O servidor estará disponível em `http://localhost:3333`

## 📝 Endpoints disponíveis

### Autenticação
- `POST /auth/login` - Login de usuário
- `POST /auth/register` - Registro de novo usuário
- `GET /auth/me` - Obter dados do usuário atual
- `POST /auth/refresh-token` - Renovar token

### Teste
- `GET /` - Informações da API

## 🔑 Usuários de teste

O backend já vem com alguns usuários pré-configurados:

| Email | Senha | Role |
|-------|-------|------|
| admin@barbearia.com | 123456 | admin |
| barbeiro@barbearia.com | 123456 | professional |
| cliente@email.com | 123456 | customer |

## 🧪 Testando a API

### Teste de login
```bash
curl -X POST http://localhost:3333/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@barbearia.com",
    "password": "123456"
  }'
```

### Teste de registro
```bash
curl -X POST http://localhost:3333/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "novo@barbearia.com",
    "password": "123456",
    "name": "Novo Usuário",
    "role": "professional"
  }'
```

### Teste de autenticação
```bash
# Primeiro faça login para obter o token
TOKEN="seu-token-aqui"

curl -X GET http://localhost:3333/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

## 🔧 Integração com o Frontend

1. **Configure o frontend** para apontar para este backend:
   ```env
   VITE_API_URL=http://localhost:3333
   ```

2. **Execute o frontend**:
   ```bash
   npm run dev
   ```

3. **Teste o login** no frontend usando os usuários de teste

## 📁 Estrutura do projeto

```
backend-example/
├── server.js          # Servidor principal
├── package.json       # Dependências
└── README.md         # Este arquivo
```

## 🛠️ Tecnologias utilizadas

- **Express.js** - Framework web
- **bcryptjs** - Hash de senhas
- **jsonwebtoken** - Autenticação JWT
- **cors** - Cross-origin resource sharing

## 🔒 Segurança

⚠️ **Atenção**: Este é um exemplo para desenvolvimento. Para produção:

1. Use um banco de dados real (PostgreSQL, MySQL, etc.)
2. Configure HTTPS
3. Implemente rate limiting
4. Use variáveis de ambiente seguras
5. Implemente validações mais robustas
6. Adicione logs de auditoria

## 🚀 Próximos passos

1. Implementar banco de dados real
2. Adicionar endpoints para serviços, agendamentos, etc.
3. Implementar upload de arquivos
4. Adicionar notificações
5. Implementar sistema de permissões mais robusto

---

Agora você pode testar a integração completa entre frontend e backend! 🎉 
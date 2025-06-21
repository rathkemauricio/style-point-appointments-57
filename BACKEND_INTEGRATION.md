# Integração com Backend - Autenticação

Este guia mostra como implementar o backend para receber as requisições de autenticação do frontend.

## 🏗️ Estrutura da API de Autenticação

### Endpoints Necessários

```typescript
// src/config/api.config.ts
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        ME: '/auth/me',
        REFRESH_TOKEN: '/auth/refresh-token',
    },
    // ... outros endpoints
};
```

## 🔐 Implementação do Backend

### 1. Estrutura de Dados

#### Modelo de Usuário
```typescript
interface User {
  id: string;
  email: string;
  password: string; // Hash da senha
  name: string;
  role: 'admin' | 'professional' | 'customer';
  professionalId?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: string;
    email: string;
    role: 'admin' | 'professional' | 'customer';
    professionalId?: string;
  };
  token: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'professional' | 'customer';
  professionalId?: string;
}
```

### 2. Exemplo com Node.js + Express + JWT

#### Instalação das dependências
```bash
npm install express bcryptjs jsonwebtoken cors dotenv
npm install -D @types/express @types/bcryptjs @types/jsonwebtoken @types/cors
```

#### Configuração do servidor
```typescript
// server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());

// Rotas
app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

#### Middleware de autenticação
```typescript
// middleware/auth.ts
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido' });
  }
};
```

#### Rotas de autenticação
```typescript
// routes/auth.ts
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Simulação de banco de dados (substitua por sua implementação real)
let users: any[] = [
  {
    id: 'admin-1',
    email: 'admin@barbearia.com',
    password: '$2a$10$hashedpassword', // Senha: 123456
    name: 'Administrador',
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validação
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email e senha são obrigatórios' 
      });
    }

    // Buscar usuário
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ 
        message: 'Credenciais inválidas' 
      });
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        message: 'Credenciais inválidas' 
      });
    }

    // Gerar token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    // Retornar resposta
    const response: LoginResponse = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        professionalId: user.professionalId
      },
      token
    };

    res.json(response);
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role, professionalId } = req.body;

    // Validação
    if (!email || !password || !name || !role) {
      return res.status(400).json({ 
        message: 'Todos os campos são obrigatórios' 
      });
    }

    // Verificar se usuário já existe
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({ 
        message: 'Usuário já existe' 
      });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      password: hashedPassword,
      name,
      role,
      professionalId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    users.push(newUser);

    // Gerar token
    const token = jwt.sign(
      { 
        id: newUser.id, 
        email: newUser.email, 
        role: newUser.role 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    // Retornar resposta
    const response: LoginResponse = {
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        professionalId: newUser.professionalId
      },
      token
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// GET /auth/me
router.get('/me', authenticateToken, (req: any, res) => {
  try {
    const userId = req.user.id;
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        professionalId: user.professionalId
      }
    });
  } catch (error) {
    console.error('Erro ao obter usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// POST /auth/refresh-token
router.post('/refresh-token', authenticateToken, (req: any, res) => {
  try {
    const userId = req.user.id;
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Gerar novo token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Erro ao renovar token:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export default router;
```

### 3. Exemplo com Prisma + PostgreSQL

#### Schema do banco de dados
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id             String   @id @default(cuid())
  email          String   @unique
  password       String
  name           String
  role           UserRole
  professionalId String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@map("users")
}

enum UserRole {
  ADMIN
  PROFESSIONAL
  CUSTOMER
}
```

#### Serviço de usuário
```typescript
// services/userService.ts
import { PrismaClient, User, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export class UserService {
  async createUser(data: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    professionalId?: string;
  }): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return prisma.user.create({
      data: {
        ...data,
        password: hashedPassword
      }
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email }
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id }
    });
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
}
```

### 4. Exemplo com TypeORM + MySQL

#### Entidade de usuário
```typescript
// entities/User.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  PROFESSIONAL = 'professional',
  CUSTOMER = 'customer'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER
  })
  role: UserRole;

  @Column({ nullable: true })
  professionalId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

## 🔧 Configuração do Frontend

### Variáveis de ambiente
```env
# .env
VITE_API_URL=http://localhost:3333
VITE_API_TIMEOUT=10000
```

### Testando a integração

1. **Inicie o backend**:
```bash
npm run dev
# ou
yarn dev
```

2. **Teste o login**:
```bash
curl -X POST http://localhost:3333/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@barbearia.com",
    "password": "123456"
  }'
```

3. **Teste o registro**:
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

## 🚀 Próximos Passos

1. **Implemente o banco de dados** de sua preferência
2. **Adicione validações** mais robustas
3. **Implemente rate limiting** para prevenir ataques
4. **Adicione logs** para auditoria
5. **Configure HTTPS** em produção
6. **Implemente refresh tokens** mais seguros

## 📚 Recursos Adicionais

- [JWT.io](https://jwt.io/) - Documentação sobre JWT
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js/) - Hash de senhas
- [Prisma](https://www.prisma.io/) - ORM moderno
- [TypeORM](https://typeorm.io/) - ORM para TypeScript

---

A integração está pronta! O frontend tentará se conectar à API real e, se não conseguir, usará os usuários de teste para desenvolvimento. 🎉 
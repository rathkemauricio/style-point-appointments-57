const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3333;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Simulação de banco de dados
let users = [
    {
        id: 'admin-1',
        email: 'admin@barbearia.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 123456
        name: 'Administrador',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 'professional-1',
        email: 'barbeiro@barbearia.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 123456
        name: 'Barbeiro',
        role: 'professional',
        professionalId: 'prof-1',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 'customer-1',
        email: 'cliente@email.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 123456
        name: 'Cliente',
        role: 'customer',
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido' });
        }
        req.user = user;
        next();
    });
};

// Rotas de autenticação

// POST /auth/login
app.post('/auth/login', async (req, res) => {
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
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Retornar resposta
        const response = {
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
app.post('/auth/register', async (req, res) => {
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
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Retornar resposta
        const response = {
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
app.get('/auth/me', authenticateToken, (req, res) => {
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
app.post('/auth/refresh-token', authenticateToken, (req, res) => {
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
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token });
    } catch (error) {
        console.error('Erro ao renovar token:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Rota de teste
app.get('/', (req, res) => {
    res.json({
        message: 'API de Autenticação funcionando!',
        endpoints: {
            login: 'POST /auth/login',
            register: 'POST /auth/register',
            me: 'GET /auth/me',
            refreshToken: 'POST /auth/refresh-token'
        }
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📝 Endpoints disponíveis:`);
    console.log(`   POST /auth/login`);
    console.log(`   POST /auth/register`);
    console.log(`   GET /auth/me`);
    console.log(`   POST /auth/refresh-token`);
    console.log(`\n🔑 Usuários de teste:`);
    console.log(`   admin@barbearia.com / 123456`);
    console.log(`   barbeiro@barbearia.com / 123456`);
    console.log(`   cliente@email.com / 123456`);
}); 
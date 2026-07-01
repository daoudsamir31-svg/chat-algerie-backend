const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// دالة التسجيل (Signup)
exports.signup = async (req, res) => {
    try {
        const { name, email, password, gender, age, city } = req.body;

        // التحقق من وجود المستخدم مسبقاً
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }

        // تشفير كلمة المرور
        const hashedPassword = await bcrypt.hash(password, 10);

        // إدخال المستخدم الجديد
        const result = await pool.query(
            `INSERT INTO users (name, email, password, gender, age, city) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email`,
            [name, email, hashedPassword, gender, age, city]
        );

        const user = result.rows[0];

        // إنشاء توكن JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: '✅ Compte créé avec succès',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '❌ Erreur serveur' });
    }
};

// دالة تسجيل الدخول (Login)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // البحث عن المستخدم
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        // التحقق من كلمة المرور
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        // إنشاء توكن JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: '✅ Connexion réussie',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                gender: user.gender,
                age: user.age,
                city: user.city,
                profile_pic: user.profile_pic
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '❌ Erreur serveur' });
    }
}; 

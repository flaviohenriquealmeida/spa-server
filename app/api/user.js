const jwt = require('jsonwebtoken');
const { UserDao } = require('../infra');

const api = {}

api.login = async (req, res) => {
    const { email, password } = req.body;
    console.log('####################################');
    const user = await new UserDao(req.db).findByEmailAndPassword(email, password);
    console.log(user);
    if(user) {
        console.log(`User ${user.userName} ${user.email} authenticated`);
        console.log('Authentication Token added to response');
        const token = jwt.sign(user, req.app.get('secret'), {
            expiresIn: 86400 // seconds, 24h
        });
        res.set('x-access-token', token);
        return res.json(user);
    } else {
        console.log(`Authentication failed for ${email}`);
        console.log('No token generated');
        res.status(401).json({ message: `Authentication failed for user ${email}`});  
    }
};

api.register = async (req, res) => {
    const user = req.body;
    const userId = await new UserDao(req.db).add(user);
    res.status(204).end();
};

api.checkUserNameTaken = async (req, res) => {
    const { userName } = req.params;
    const user = await new UserDao(req.db).findByName(userName);
    res.json(!!user);
};

api.checkEmailTaken = async (req, res) => {
    const { email } = req.params;
    const user = await new UserDao(req.db).findByEmail(email);
    res.json(!!user);
};

module.exports = api;
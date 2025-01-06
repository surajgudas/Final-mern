import express from "express";
import mongoose from "mongoose";
import path from "path";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/paytm_clone', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Add these schemas
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String,
    balance: { type: Number, default: 10000 }
});

const User = mongoose.model('User', userSchema);

// Update transaction schema to include user reference
const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: String,
    amount: Number,
    description: String,
    category: String,
    recipient: String,
    date: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Serve static files
app.use(express.static(path.join(__dirname, '../paytm clone')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../paytm clone/index.html'));
});

// Handle routes for different sections
const routes = ['company', 'career', 'about'];
routes.forEach(route => {
    app.get(`/${route}`, (req, res) => {
        res.sendFile(path.join(__dirname, '../paytm clone/index.html'));
    });
});

// Create content for each route
const content = {
    home: {
        title: 'Welcome to Paytm Clone',
        content: 'Your one-stop solution for digital payments'
    },
    company: {
        title: 'Our Company',
        content: 'Learn about our mission and values'
    },
    career: {
        title: 'Careers',
        content: 'Join our team and make a difference'
    },
    about: {
        title: 'About Us',
        content: 'Our story and journey'
    }
};

// API endpoint to get content
app.get('/api/content/:page', (req, res) => {
    const page = req.params.page;
    res.json(content[page] || content.home);
});

// API Routes for transactions
app.post('/api/transactions', async (req, res) => {
    try {
        const { type, amount, description, category, recipient } = req.body;
        const transaction = new Transaction({
            type,
            amount,
            description,
            category,
            recipient,
            date: new Date()
        });
        await transaction.save();
        res.status(201).json(transaction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/transactions', async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .sort({ date: -1 })
            .limit(10);
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/balance', async (req, res) => {
    try {
        const transactions = await Transaction.find();
        const balance = transactions.reduce((acc, curr) => {
            return curr.type === 'credit' 
                ? acc + curr.amount 
                : acc - curr.amount;
        }, 10000); // Starting balance of 10,000
        res.json({ balance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get recent transactions with details
app.get('/api/transactions/recent', async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .sort({ date: -1 })
            .limit(10)
            .select('type amount description category recipient date');
        
        const formattedTransactions = transactions.map(t => ({
            ...t._doc,
            date: t.date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }),
            amount: t.amount.toLocaleString('en-IN', {
                style: 'currency',
                currency: 'INR'
            })
        }));
        
        res.json(formattedTransactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add these API endpoints
app.post('/api/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const user = new User({
            firstName,
            lastName,
            email,
            password, // In production, hash the password
            balance: 10000
        });
        await user.save();
        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password }); // In production, compare hashed passwords
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        res.json({ 
            userId: user._id,
            firstName: user.firstName,
            balance: user.balance
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/transactions/:userId', async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.params.userId })
            .sort({ date: -1 })
            .limit(10);
        
        const formattedTransactions = transactions.map(t => ({
            type: t.type,
            amount: t.amount.toLocaleString('en-IN', {
                style: 'currency',
                currency: 'INR'
            }),
            description: t.description,
            recipient: t.recipient,
            date: t.date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            })
        }));
        
        res.json(formattedTransactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/balance/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ balance: user.balance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
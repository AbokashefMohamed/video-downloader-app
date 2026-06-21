import { User } from "../models/User.js";
import { validateEmail, validatePassword } from "../utils/validators.js";
import { signToken } from "../utils/jwt.js";

export async function register(req, res) {
    const { email, password, name } = req.body;

    const emailError = validateEmail(email);
    if (emailError) {
        return res.status(400).json({ message: emailError});
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
        return res.status(400).json({ message: passwordError});
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
        return res.status(409).json({ message: "An account with this email already exists"});
    }

    const user = await User.create({ email, password, name  });

    res.status(201).json({ 
        id: user._id,
        email: user.email,
        name: user.name,
    });
}

export async function login(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase()}).select("+password");
    if (!user) {
        return res.status(401).json({ message: "Invalid email or password"});
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password"});
    }

    const token = signToken(user._id.toString());

    res.json({
        token,
        user: { id: user._id, email: user.email, name: user.name},
    });
}

export async function getMe(req, res) {
    const user = await User.findById(req.userId);

    if(!user) {
        return res.status(404).json({ message: "User not found"});
    }

    res.json({id: user._id, email: user.email, name: user.name});
}
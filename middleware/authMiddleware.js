import jwt from "jsonwebtoken";

const protect = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers["authorization"];
        if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized - Missing or invalid token" });
        }

        const token = authorizationHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error("JWT verification error:", err);
                return res.status(401).json({ message: "Unauthorized - Invalid token" });
            }
            // Check if 'id' exists in decoded token
            if (!decoded || !decoded.id) {
                console.error("Token does not contain 'id' field:", decoded);
                return res.status(401).json({ message: "Unauthorized - Invalid token" });
            }
            // Set 'userId' in request body
            req.body.userId = decoded.id;
            next();
        });
    } catch (error) {
        console.error("Error in auth middleware:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export default protect;

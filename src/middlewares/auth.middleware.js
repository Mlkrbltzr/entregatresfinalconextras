export const adminValidator = (req, res, next) => {
    if (req?.user?.role === "admin") return next();
    return res.status(401).json({ error: "Unauthorized, only for admin" });
}

export const userValidator = (req, res, next) => {
    if (req?.user?.role === "user") return next();
    return res.status(401).json({ error: "Unauthorized, only for user" });
}
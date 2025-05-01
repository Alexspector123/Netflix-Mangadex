// backend/middleware/checkVip.js
export const checkVip = (req, _res, next) => {
    if (!req.user?.isVip) {
        return _res.status(403).json({
            success: false,
            message: "This feature is only available for VIP accounts.",
        });
    }
    next();
};
export const checkAdmin = (req, _res, next) => {
    if (!req.user?.isAdmin) {
        return _res.status(403).json({
            success: false,
            message: "This feature is only available for Admin accounts.",
        });
    }
    next();
};
export const checkVipOrAdmin = (req, _res, next) => {
    if (!req.user?.isVip && !req.user?.isAdmin) {
        return _res.status(403).json({
            success: false,
            message: "This feature is only available for VIP or Admin accounts.",
        });
    }
    next();
};
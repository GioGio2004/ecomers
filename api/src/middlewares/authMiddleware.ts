import { Request, Response, NextFunction } from 'express';
import jwt, { decode } from 'jsonwebtoken';

export function verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = req.header('Authorization')

    if (!token) {
        res.status(401).json({ error: "access denied" })
        return
    }
    try {
        const decoded = jwt.verify(token, "your-secter")
        if (typeof decoded != 'object' || !decoded?.userId) {
            res.status(401).json({ error: "access denied" })
        }
        //@ts-ignore
        req.userId = decoded.userId
        console.log(decoded)
        next()
    } catch (e) {
        res.status(401).json({ error: "access denied" })

    }
}



export function verifySeller(req: Request, res: Response, next: NextFunction) {
    const token = req.header('Authorization')

    if (!token) {
        res.status(401).json({ error: "access denied" })
        return
    }
    try {
        const decoded = jwt.verify(token, "your-secter")
        if (typeof decoded != 'object' || !decoded?.userId) {
            res.status(401).json({ error: "access denied" })
        }
        //@ts-ignore
        if (decoded?.role != 'seller') {
            res.status(401).json({ error: "yoou dont have access. not as seller" })
        }
        //@ts-ignore
        req.userId = decoded.userId
        console.log(decoded)
        next()
    } catch (e) {
        res.status(401).json({ error: "access denied" })

    }
}
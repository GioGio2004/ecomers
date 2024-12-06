import { Router } from "express";
import { validateData } from "../../middlewares/validationMiddleware.js";
import { createUsersSchema, loginSchema, usersTable } from "../../db/usersSchema.js";
import bcrypt from 'bcryptjs'
import { db } from "../../db/index.js";
import { eq } from "drizzle-orm";
import jwt from 'jsonwebtoken'

const router = Router()


router.post('/register', validateData(createUsersSchema), async (req, res) => {
    try {
        const data = req.cleanBody
        data.password = await bcrypt.hash(data.password, 10)
        const [user] = await db.insert(usersTable).values(data).returning()

        res.status(201).json({ user })
    } catch (e) {
        res.status(500).send("something went wrong")
    }


})

router.post('/login', validateData(loginSchema), async (req, res) => {
    try {
        const { email, password } = req.cleanBody;

        const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email))

        if (!user) {
            res.status(401).json({ error: "Authenticaiton failed" })
            return
        }

        const matched = await bcrypt.compare(password, user.password)

        if (!matched) {
            res.status(401).json({ error: "Authenticaiton failed" })
            return
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, "your-secter", { expiresIn: '30d' })
        
        //@ts-ignore
        delete user.password
        res.status(200).json({ token, user })
        console.log(email, password)

    } catch (e) {
        res.status(500).send("something went wrong")
    }
})

export default router


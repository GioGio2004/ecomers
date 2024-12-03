import { Router } from "express"

const router = Router()

router.get('/', (req, res) =>{
    res.send("list of products")
})

router.get('/:id', (req, res) =>{
    console.log(req.params)
    res.send("a products")
})

router.post('/', (req, res)=>{
    res.send("new products")
})  


export default router
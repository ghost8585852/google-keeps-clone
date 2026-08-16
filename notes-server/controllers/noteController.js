import pool from "../db/db.js";


export async function getAllNotes(req,res){
    try{
        const result = await pool.query(
            "SELECT * FROM notes ORDER BY id DESC"
        );
        res.json(result.rows);
    }catch(error){
        console.error(error);
        res.status(500).json({error:"failed to get data "});
    }
}





export async function createNotes(req,res){
    console.log("CREATE NOTES WAS CALLED");

    try{
      const { title , content , backgroundcolor, image ,isdeleted } = req.body;
    const result = await pool.query(
        `INSERT INTO notes
        (title, content, backgroundcolor, image ,isdeleted)
        VALUES ($1 ,$2, $3, $4, $5)
        RETURNING * `,
        [title, content, backgroundcolor, image, isdeleted]
    );

    res.status(201).json(result.rows[0]);  
    }catch(error){
        console.error(error);
        res.status(500).json({error:"failed to create note"});
    }
    
}




export async function DeleteNote(req,res){
    const {id}=req.body;
    try{
        const result = await pool.query(
            `DELETE FROM notes
             WHERE id = $1`,
             [id]
        );
        if(result.rowCount === 0){
            return res.status(404).json({
                error:"Note not found"
            });
        }else{
            res.status(200).json({
                message: "Note deleted successfully",
                note: result.rows[0]
            });
        }
    }catch(error){
        console.error(error);
        res.status(500).json({error:"failed to delete the note"});
    }
}
export async function UpdateNotes(req,res){
    const {id} = req.params;
    const {title, content , backgroundcolor, image , isdeleted } = req.body;

    try{
        const result = await pool.query(
            `UPDATE notes
             set 
                title = COALESCE($1 ,title),
                content = COALESCE($2 ,content),
                backgroundcolor = COALESCE($3 ,backgroundcolor),
                image = COALESCE($4 ,image),
                isdeleted = COALESCE($5 ,isdeleted)
                WHERE id = $6
                RETURNING *`,
                [title, content , backgroundcolor , image ,isdeleted, id]
        );

        if(result.rowCount === 0){
          return  res.status(404).json({
                "error":"Note not found "
            });
        }else{
            res.status(200).json({
                message:"note successfully updated",
                note:result.rows[0]
            });
        }
    }catch(error){
        console.error(error);
        res.status(500).json({error:"message didn't updated"});
    }
}

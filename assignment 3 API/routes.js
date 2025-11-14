import express from 'express';
import sql from 'mssql';
import 'dotenv/config'

const router = express.Router();

const db_connection_string = process.env.DB_CONNECTION_STRING;

// GET: /api/photos/
router.get('/', async (req, res) => {

    // Get a collection of photo objects from the database
    await sql.connect(db_connection_string);

    const result = await sql.query`SELECT a.[PhotoId], a.[Title] as PhotoTitle, a.[Description], a.[Filename], a.[CreateDate], a.[Camera], b.[CategoryId], b.[Title] as CategoryTitle
        FROM [dbo].[Photo] a
        INNER JOIN [dbo].[Category] b
        ON a.[CategoryId] = b.[CategoryId]        
        ORDER BY a.[CreateDate] DESC`;
    
    // return the result recordset as JSON
    res.json(result.recordset);
});

// GET: /api/photo/1
router.get('/:id', async (req, res) => {
    const id = req.params.id; 
    
    if(isNaN(id)) {
        return res.status(400).json({ error: 'Invalid photo ID. It must be a number.' });
    }

    // Get a one photo object from the database
    await sql.connect(db_connection_string);

    const result = await sql.query`SELECT a.[PhotoId], a.[Title] as PhotoTitle, a.[Description], a.[Filename], a.[CreateDate], a.[Camera], b.[CategoryId], b.[Title] as CategoryTitle
        FROM [dbo].[Photo] a
        INNER JOIN [dbo].[Category] b
        ON a.[CategoryId] = b.[CategoryId]
        WHERE a.[PhotoId] = ${id}`

    // No photo found
    if(result.recordset.length === 0) {
        // photo not found
        return res.status(404).json({ error: 'Photo not found.' });
    }
console.log(result);
    // send the photo object as JSON
    res.json(result.recordset);
});

// POST: /api/photos/comment
router.post('/comment', async (req, res) => {
    const comment = req.body;

    // *******************************************
    // TO-DO: Validate input
    // *******************************************

    // Get a one photo object from the database
    await sql.connect(db_connection_string);

    const result = await sql.query`INSERT INTO [dbo].[Comment]
        (Author, Body, CreateDate, PhotoId)
        VALUES
        (${comment.Author}, ${comment.Body}, GetDate(), ${comment.PhotoId})`;

    if(result.rowsAffected[0] === 0) {
        return res.status(500).json({ error: 'Failed to insert comment.' });
    }
    else {
        res.send('Comment inserted into db.');
    }    
});


export default router;
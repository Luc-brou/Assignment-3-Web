import express from 'express';
import sql from 'mssql';
import 'dotenv/config';

const router = express.Router();
const db_connection_string = process.env.DB_CONNECTION_STRING;

// GET /api/concerts
router.get('/', async (req, res) => {
    await sql.connect(db_connection_string);

    const result = await sql.query`
        SELECT c.ConcertID, c.Title, c.Description, c.Filename, c.CreateDate, c.ConcertDate,
               g.GenreID, g.Title AS GenreTitle
        FROM dbo.Concerts c
        INNER JOIN dbo.Genres g ON c.GenreID = g.GenreID
        ORDER BY c.CreateDate DESC
    `;

    res.json(result.recordset);
});

// GET /api/concerts/:id
router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);

    await sql.connect(db_connection_string);

    const result = await sql.query`
        SELECT c.ConcertID, c.Title, c.Description, c.Filename, c.CreateDate, c.ConcertDate,
               g.GenreID, g.Title AS GenreTitle
        FROM dbo.Concerts c
        INNER JOIN dbo.Genres g ON c.GenreID = g.GenreID
        WHERE c.ConcertID = ${id}
    `;

    res.json(result.recordset);
});

// POST /api/concerts/purchases
router.post('/purchases', async (req, res) => {
    const { concertId, numTickets, customerDetails, cardToken } = req.body;

    await sql.connect(db_connection_string);

    const insert = await sql.query`
        INSERT INTO dbo.Purchase (ConcertID, NumTicketsOrdered, CustomerDetails, CardToken)
        VALUES (${concertId}, ${numTickets}, ${customerDetails}, ${cardToken});
        SELECT SCOPE_IDENTITY() AS TicketID;
    `;

    res.json(insert.recordset);
});

export default router;
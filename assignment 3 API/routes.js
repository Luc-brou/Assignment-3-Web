import express from 'express';
import sql from 'mssql';
import 'dotenv/config';

const router = express.Router();
const db_connection_string = process.env.DB_CONNECTION_STRING;

// GET /api/concerts (all upcoming events)
router.get('/', async (req, res) => {
    await sql.connect(db_connection_string);

    const result = await sql.query`
        SELECT c.ConcertID, c.Title, c.Description, c.Filename, c.CreateDate, c.ConcertDate,
               g.GenreID, g.Title AS GenreTitle
        FROM dbo.Concerts c
        INNER JOIN dbo.Genres g ON c.GenreID = g.GenreID
        WHERE c.ConcertDate >= GETDATE()
        ORDER BY c.ConcertDate ASC
    `;

    if (result.recordset.length === 0) {
        return res.send('<p>No concerts found</p>');
    }

    let html = '<table border="1"><tr>';
    Object.keys(result.recordset[0]).forEach(col => { html += `<th>${col}</th>`; });
    html += '</tr>';
    result.recordset.forEach(row => {
        html += '<tr>';
        Object.values(row).forEach(val => { html += `<td>${val}</td>`; });
        html += '</tr>';
    });
    html += '</table>';

    res.send(html);
});

// // POST /api/concerts/purchases (record a purchase)
// router.post('/purchases', async (req, res) => {
//     const { concertId, numTickets, customerDetails, cardToken } = req.body;
//     await sql.connect(db_connection_string);

//     const insert = await sql.query`
//         INSERT INTO dbo.Purchase (ConcertID, NumTicketsOrdered, CustomerDetails, CardToken)
//         VALUES (${concertId}, ${numTickets}, ${customerDetails}, ${cardToken});
//         SELECT SCOPE_IDENTITY() AS TicketID;
//     `;

//     let html = '<table border="1"><tr>';
//     Object.keys(insert.recordset[0]).forEach(col => { html += `<th>${col}</th>`; });
//     html += '</tr><tr>';
//     Object.values(insert.recordset[0]).forEach(val => { html += `<td>${val}</td>`; });
//     html += '</tr></table>';

//     res.send(html);
// });

// GET /api/concerts/purchases (return all purchases across all events)
router.get('/purchases', async (req, res) => {
    await sql.connect(db_connection_string);

    const result = await sql.query`
        SELECT p.TicketID, p.NumTicketsOrdered, p.CustomerDetails, p.CardToken,
               p.ConcertID, c.Title AS ConcertTitle
        FROM dbo.Purchase p
        INNER JOIN dbo.Concerts c ON p.ConcertID = c.ConcertID
        ORDER BY p.TicketID DESC
    `;

    // if (result.recordset.length === 0) {
    //     return res.send('<p>No purchases found</p>');
    // }

    let html = '<table border="1"><tr>';
    Object.keys(result.recordset[0]).forEach(col => { html += `<th>${col}</th>`; });
    html += '</tr>';
    result.recordset.forEach(row => {
        html += '<tr>';
        Object.values(row).forEach(val => { html += `<td>${val}</td>`; });
        html += '</tr>';
    });
    html += '</table>';

    res.send(html);
});

// GET /api/concerts/:id (individual event by ID)
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

    if (result.recordset.length === 0) {
        return res.send('<p>No event found</p>');
    }

    let html = '<table border="1"><tr>';
    Object.keys(result.recordset[0]).forEach(col => { html += `<th>${col}</th>`; });
    html += '</tr>';
    result.recordset.forEach(row => {
        html += '<tr>';
        Object.values(row).forEach(val => { html += `<td>${val}</td>`; });
        html += '</tr>';
    });
    html += '</table>';

    res.send(html);
});

// GET /api/concerts/:id/purchases (all purchases for an event)
router.get('/:id/purchases', async (req, res) => {
    const id = Number(req.params.id);
    await sql.connect(db_connection_string);

    const result = await sql.query`
        SELECT p.TicketID, p.NumTicketsOrdered, p.CustomerDetails, p.CardToken,
               p.ConcertID, c.Title AS ConcertTitle
        FROM dbo.Purchase p
        INNER JOIN dbo.Concerts c ON p.ConcertID = c.ConcertID
        WHERE p.ConcertID = ${id}
        ORDER BY p.TicketID DESC
    `;

    if (result.recordset.length === 0) {
        return res.send('<p>No purchases found</p>');
    }

    let html = '<table border="1"><tr>';
    Object.keys(result.recordset[0]).forEach(col => { html += `<th>${col}</th>`; });
    html += '</tr>';
    result.recordset.forEach(row => {
        html += '<tr>';
        Object.values(row).forEach(val => { html += `<td>${val}</td>`; });
        html += '</tr>';
    });
    html += '</table>';

    res.send(html);
});

export default router;
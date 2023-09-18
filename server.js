import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'pug'); // Set Pug as the view engine


const pool = new pg.Pool({
  connectionString: 'postgresql://test:test@localhost:5432/test',
});


export default config => {

// GET request to display the list of car models
app.get('/', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM cars');
      res.render('carList', { cars: rows }); // Render carList.pug with the retrieved data
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// GET all cars
app.get('/cars', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM cars');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET a single car by ID
app.get('/cars/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM cars WHERE id = $1', [id]);
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST a new car
app.post('/cars', async (req, res) => {
  const { name, code, make, measures } = req.body;
  try {
    await pool.query(
      'INSERT INTO cars (name, code, make, measures) VALUES ($1, $2, $3, $4)',
      [name, code, make, measures]
    );
    res.status(201).json({ message: 'Car added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT (update) a car by ID
app.put('/cars/:id', async (req, res) => {
  const { id } = req.params;
  const { name, code, make, measures } = req.body;
  try {
    await pool.query(
      'UPDATE cars SET name=$1, code=$2, make=$3, measures=$4 WHERE id=$5',
      [name, code, make, measures, id]
    );
    res.json({ message: 'Car updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE a car by ID
app.delete('/cars/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM cars WHERE id = $1', [id]);
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

return app;
}

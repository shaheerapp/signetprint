const express = require('express');
const admin = require('firebase-admin');
const app = express();

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    // databaseURL: 'https://<your-database-name>.firebaseio.com'
});

const db = admin.firestore();

app.use(express.json());

app.post('/api/print-request', async (req, res) => {
    const { fileUrl, fullName, desiredDate } = req.body;

    if (!fileUrl || !fullName || !desiredDate) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const docRef = await db.collection('print_requests').add({
            fileUrl,
            fullName,
            desiredDate,
            status: 'pending',
        });
        res.status(200).json({ message: 'Print request submitted successfully', id: docRef.id });
    } catch (error) {
        res.status(500).json({ error: 'Error submitting print request' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

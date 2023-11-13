var express = require("express");
var router = express.Router();
const { google } = require('googleapis')

const youtube = google.youtube({
    version: 'v3',
    auth: 'AIzaSyB2fd4KnX50E0kVYLCj3NWAKEdnKE_2LLM' 
  });


  router.get('/search/videos', (req, res) => {
    const query = req.query.q; 

    youtube.search.list({
        part: 'snippet',
        q: query,
        maxResults: 20
    }, (err, response) => {
        if (err) {
            console.error('Error en la búsqueda de videos de YouTube:', err); // Registrando el error para depuración
            // Enviar una respuesta más detallada
            res.status(500).json({
                success: false,
                message: 'Error al realizar la búsqueda en YouTube',
                error: err.message // Proporciona el mensaje de error
            });
            return;
        }
        res.json(response.data); // Si no hay error, envía los datos de respuesta
    });
});


  router.get('/video/details', (req, res) => {
    const videoId = req.query.id; 

    if (!videoId) {
        return res.status(400).send({ message: 'Se requiere el ID del video' });
    }

    youtube.videos.list({
        part: 'snippet,contentDetails',
        id: videoId
    }, (err, response) => {
        if (err) {
            res.status(500).send(err);
            return;
        }

        if (response.data.items.length > 0) {
            res.json(response.data.items[0]);
        } else {
            res.status(404).send({ message: 'Video no encontrado' });
        }
    });
});


module.exports = router;
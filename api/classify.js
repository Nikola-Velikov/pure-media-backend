module.exports = async (req, res) => {
    try {
        // Get the 'text' query parameter from the request URL
        const text = req.query.text;

        // Check if the 'text' query parameter is provided
        if (!text) {
            return res.status(400).json({
                success: false,
                message: "Text parameter is missing."
            });
        }

        // Make a request to the external classification API using native fetch
        const response = await fetch(`https://puremediaai-production.up.railway.app/classify?text=${encodeURIComponent(text)}`);

        // If the response is not ok, return an error message
        if (!response.ok) {
            return res.status(500).json({
                success: false,
                message: "Failed to classify the text. The external API did not respond properly."
            });
        }

        // Parse the JSON response from the external API
        const classificationResult = await response.json();

        // Return the classification result
        return res.status(200).json({
            success: true,
            result: classificationResult
        });

    } catch (err) {
        // Catch any unexpected errors and log them
        console.error(err);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

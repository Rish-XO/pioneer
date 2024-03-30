const axios = require('axios'); 


/**
 * @swagger
 * /data-api:
 *   get:
 *     summary: Fetch data from a public API
 *     description: Retrieves data from the public API at https://api.publicapis.org/entries. You can filter results by category and limit the number of results.
 *     parameters:
 *       - in: query
 *         name: category
 *         description: Filter results by category (case-insensitive)
 *         type: string
 *       - in: query
 *         name: limit
 *         description: Limit the number of results returned (positive integer)
 *         type: integer
 *     responses:
 *       200:
 *         description: Data fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   API:
 *                     type: string
 *                   Description:
 *                     type: string
 *                   Auth:
 *                     type: string
 *                   HTTPS:
 *                     type: boolean
 *                   Cors:
 *                     type: string
 *                   Link:
 *                     type: string
 *                   Category:
 *                     type: string
 *       400:
 *         description: Invalid query parameter (e.g., invalid limit value)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
exports.fetchData = async (req, res) => {
    try {
        // Fetch data from the public API
        const response = await axios.get("https://api.publicapis.org/entries");
        const { entries } = response.data;
    
        // Apply filtering options
        let filteredData = entries;
    
        // Filter by category if specified
        const category = req.query.category;
        if (category) {
          //edge case of invalid category
          const categoryExists = entries.some(
            (api) => api.Category.toLowerCase() === category.toLowerCase()
          );
          if (!categoryExists) {
            return res.status(404).json({ message: "Category not found" });
          }
          filteredData = filteredData.filter(
            (api) => api.Category.toLowerCase() === category.toLowerCase()
          );
        }
    
        // Limit results if specified
        const limit = req.query.limit ? parseInt(req.query.limit) : entries.length;
    
        //edge case for invalid limit
        if (isNaN(limit) || limit < 0) {
          return res.status(400).json({ message: "Invalid limit parameter" });
        }
    
        filteredData = filteredData.slice(0, limit);
    
        res.json(filteredData);
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ message: "Internal server error" });
      }
  };
const axios = require('axios'); 

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
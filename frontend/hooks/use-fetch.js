const { useState } = require("react");
const { toast } = require("sonner");

const useFetch = (fetchAction, params) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fn = async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchAction(...args);
      setData(response);
      setError(null);
    } catch (err) {
      setError(err);
      toast.error(err.message || "An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn, setData };
};

export default useFetch;

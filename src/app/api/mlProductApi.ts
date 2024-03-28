interface Product {
  id: string;
  name: string;
  url: string;
  price: string;
  created: string;
  state: "Playing" | "Stopped" | "Error";
  percentChange: number;
  changeDirection: string;
  updated?: Date;
}

const mlProductApi = {
  apiUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/mlProducts`,

  list: async (): Promise<Array<Product>> => {
    try {
      const response = await fetch(mlProductApi.apiUrl, { cache: "no-store" });

      if (!response.ok) {
        throw new Error(`Failed to fetch data from ${mlProductApi.apiUrl}`);
      }

      const products = await response.json();

      return products;
    } catch (error) {
      console.error("Error fetching ML products:", error);
      throw error;
    }
  }
};

export default mlProductApi;

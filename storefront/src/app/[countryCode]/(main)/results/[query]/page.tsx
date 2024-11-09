import SearchResultsTemplate from "@modules/search/templates/search-results-template"
import { getProductsList } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"

export default async function SearchResultsPage({
  params,
}: {
  params: { query: string; countryCode: string }
}) {
  const { query, countryCode } = params

  let products = []
  let region = null
  let error: string | null = null

  try {
    // Obține regiunea pentru codul țării
    region = await getRegion(countryCode)
    if (!region) {
      throw new Error("Region not found")
    }

    // Obține produsele pe baza query-ului de căutare
    const { response } = await getProductsList({
      queryParams: { q: query, limit: 12 }, // Asigură-te că trimiti query-ul pentru filtrare
      countryCode: countryCode,
    })

    products = response.products
  } catch (err) {
    error = "No products found or an error occurred."
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <div>
      {/* Render the search results */}
      <SearchResultsTemplate
        query={query}
        products={products}
        region={countryCode}
        sortBy="created_at"
        page={1}
        countryCode={countryCode}
      />
    </div>
  )
}

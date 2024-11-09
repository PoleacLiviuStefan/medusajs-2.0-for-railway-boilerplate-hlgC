import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { cache } from "react"
import { getRegion } from "./regions"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { sortProducts } from "@lib/util/sort-products"

// Funcție pentru a obține produsele după ID-uri
export const getProductsById = cache(async function ({
  ids,
  regionId,
}: {
  ids: string[]
  regionId: string
}) {
  return sdk.store.product
    .list(
      {
        id: ids,
        region_id: regionId,
        fields: "*variants.calculated_price,+variants.inventory_quantity",
      },
      { next: { tags: ["products"] } }
    )
    .then(({ products }) => products)
})

// Funcție pentru a obține un produs după handle
export const getProductByHandle = cache(async function (
  handle: string,
  regionId: string
) {
  return sdk.store.product
    .list(
      {
        handle,
        region_id: regionId,
        fields: "*variants.calculated_price,+variants.inventory_quantity",
      },
      { next: { tags: ["products"] } }
    )
    .then(({ products }) => products[0])
})

// Funcție pentru a obține lista de produse cu paginare și filtrare pe baza queryParams
export const getProductsList = async function ({
  queryParams,
  countryCode,
}: {
  queryParams?: { q?: string; id?: string[] }
  countryCode: string
}) {
  const region = await getRegion(countryCode)

  if (!region) {
    return { response: { products: [], count: 0 } }
  }

  return sdk.store.product
    .list(
      {
        q: queryParams?.q,
        id: queryParams?.id, // Filtrare pe baza ID-urilor dacă sunt furnizate
        region_id: region.id,
      },
      { next: { tags: ["products"] } }
    )
    .then(({ products, count }) => ({
      response: { products, count },
    }))
}

export const getRelatedProducts = cache(async function ({
  pageParam = 1,
  queryParams,
  countryCode,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  countryCode: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> {
  const limit = queryParams?.limit || 12
  const validPageParam = Math.max(pageParam, 1);
  const offset = (validPageParam - 1) * limit
  const region = await getRegion(countryCode)
  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }
  return sdk.store.product
    .list(
      {
        limit,
        offset,
        region_id: region.id,
        fields: "*variants.calculated_price",
        ...queryParams,
      },
      { next: { tags: ["products"] } }
    )
    .then(({ products, count }) => {
      const nextPage = count > offset + limit ? pageParam + 1 : null
      return {
        response: {
          products,
          count,
        },
        nextPage: nextPage,
        queryParams,
      }
    })
})
// Funcție pentru a obține produsele cele mai vândute
export const getTopSellingProducts = cache(async function ({
  page = 1,
  queryParams,
  countryCode,
}: {
  page?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  countryCode: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> {
  const limit = queryParams?.limit || 12

  const {
    response: { products, count },
  } = await getProductsList({
    queryParams: {
      ...queryParams,
      limit: 100, // Fetch 100 products for sorting purposes
    },
    countryCode,
  })

  const sortedProducts = products.sort((a, b) => {
    const soldA = (a as any).sold_quantity || 0
    const soldB = (b as any).sold_quantity || 0
    return soldB - soldA
  })

  const offset = (page - 1) * limit
  const nextPage = count > offset + limit ? page + 1 : null
  const paginatedProducts = sortedProducts.slice(offset, offset + limit)

  return {
    response: {
      products: paginatedProducts,
      count,
    },
    nextPage,
    queryParams,
  }
})

// Funcție pentru a obține lista de produse cu opțiuni de sortare și filtrare pe ID-uri
export const getProductsListWithSort = cache(async function ({
  page = 1,
  queryParams,
  sortBy = "created_at",
  countryCode,
}: {
  page?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  sortBy?: SortOptions
  countryCode: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> {
  const limit = queryParams?.limit || 12
  const offset = (page - 1) * limit

  if (queryParams?.id) {
    console.log("Filtering products by ID:", queryParams.id)
  }

  const {
    response: { products, count },
  } = await getProductsList({
    queryParams: {
      ...queryParams,
      limit,
      offset,
    },
    countryCode,
  })

  const sortedProducts = sortProducts(products, sortBy)
  const nextPage = count > offset + limit ? page + 1 : null

  return {
    response: {
      products: sortedProducts,
      count,
    },
    nextPage,
    queryParams,
  }
})

// Funcție pentru a cauta produsele după query (cuvinte cheie)
export async function searchProducts(query: string, countryCode: string) {
  const region = await getRegion(countryCode)
  if (!region) return []

  const { products } = await sdk.store.product.list({
    q: query,
    region_id: region.id,
  })

  return products
}

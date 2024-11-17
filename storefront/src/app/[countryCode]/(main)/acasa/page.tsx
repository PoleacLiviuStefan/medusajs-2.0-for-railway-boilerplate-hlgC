import { Metadata } from "next"
import React from "react"
import Curs from "../../../../../public/Imagini/cursuri/cursDeBaza_preview.jpg"
import Image from "next/image"
import BenefitsList from "../../../(components)/Main/BenefitsList"
import FeaturedProducts from "@modules/home/components/featured-products"
import { getCollectionsWithProducts } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Cursuri - Medusa Next.js",
  description: "Pagina pentru cursuri, folosind Medusa și Next.js 14.",
}

export default async function Page() {
  const collections = await getCollectionsWithProducts("ro")
  const region = await getRegion("ro")

  if (!collections || !region) {
    return null
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 justify-items-center py-4">
        {[...Array(4)].map((_, index) => (
          <Image
            key={index}
            src={Curs}
            width={500}
            height={500}
            alt="Curs de bază"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="w-full h-auto object-cover"
          />
        ))}
      </div>
      <BenefitsList />
      <ul className="flex flex-row gap-x-6 lg:w-[900px] ">
  <FeaturedProducts collections={collections} region={region} main={true}/>
</ul>

    </div>
  )
}

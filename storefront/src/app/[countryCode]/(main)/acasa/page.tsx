import { Metadata } from "next"
import React from "react"
import Curs from "../../../../../public/Imagini/cursuri/cursDeBaza_preview.jpg"
import Image from "next/image"
import BenefitsList from "../../../(components)/Main/BenefitsList"
import FeaturedProducts from "@modules/home/components/featured-products"
import { getCollectionsWithProducts } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import Hero from "@modules/home/components/hero"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Echipa  from '../../../../../public/Imagini/stiliste/echipa.png'
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
    <>
    <Hero image={Echipa} />
    <div className="flex flex-col items-center w-full px-[16px] lg:px-0">
      
      <div className="grid grid-cols-2 gap-6 justify-items-center py-4">
        {[...Array(4)].map((_, index) => (
          <LocalizedClientLink href="/curs-de-baza"  key={index}>
          <Image
            key={index}
            src={Curs}
          
            alt="Curs de bază"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"


            className="w-full h-auto object-cover"
          />
          </LocalizedClientLink>
        ))}
        
      </div>
      <BenefitsList />
      <ul className="flex flex-row gap-x-6 w-full  lg:w-[900px] ">
  <FeaturedProducts collections={collections} region={region} main={true}/>
</ul>

    </div>
    </>
  )
}

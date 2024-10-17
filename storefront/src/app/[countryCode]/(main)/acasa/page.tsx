import { Metadata } from "next"
import React from 'react'
import Curs from '../../../../../public/Imagini/cursuri/cursDeBaza_preview.jpg'
import Image from 'next/image'
import BenefitsList from '../../../(components)/Main/BenefitsList'

export const metadata: Metadata = {
  title: "Cursuri - Medusa Next.js",
  description: "Pagina pentru cursuri, folosind Medusa și Next.js 14.",
}

export default function Page() {
  return (
    <div className='flex flex-col items-center w-full'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-[24px] align-center justify-items-center'>
        <Image src={Curs} width={500} alt="Curs de bază" />
        <Image src={Curs} width={500} alt="Curs de bază" />
        <Image src={Curs} width={500} alt="Curs de bază" />
        <Image src={Curs} width={500} alt="Curs de bază" />
      </div>
      <BenefitsList />
    </div>
  )
}

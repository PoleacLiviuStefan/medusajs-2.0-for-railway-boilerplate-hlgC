import { Github } from "@medusajs/icons"
import { Button, Heading } from "@medusajs/ui"
import Image from 'next/image';
import Echipa  from '../../../../../public/Imagini/stiliste/echipa.png'
const Hero = () => {
  return (
    <div className="h-[500px] w-full bg-gradient-to-b from-[#ffc2ea] via-[#ffc2ea] to-white border-b border-ui-border-base relative bg-ui-bg-subtle">
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6">
      <Image alt="alt" src={Echipa} className="absolute bottom-0 w-[500px] h-auto" />

      </div>
    </div>
  )
}

export default Hero

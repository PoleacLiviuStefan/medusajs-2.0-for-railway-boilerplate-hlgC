'use client'
import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import Image from "next/image"
import { useState } from "react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [mainImage, setMainImage] = useState<HttpTypes.StoreProductImage>(images[0])
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })
  const [isZoomed, setIsZoomed] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100

    // Ajustare limite pentru zoom și menținerea cursorului în centru
    const limitedX = Math.max(20, Math.min(x, 80))
    const limitedY = Math.max(20, Math.min(y, 80))

    setZoomPosition({ x: limitedX, y: limitedY })
    setIsZoomed(true)
  }

  const handleMouseLeave = () => {
    setIsZoomed(false)
  }

  return (
    <div className="flex flex-col items-start relative">
      <Container
        className="relative aspect-[29/34] lg:w-[500px] overflow-hidden bg-ui-bg-subtle mb-4"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {!!mainImage.url && (
          <Image
            src={mainImage.url}
            priority={true}
            className="absolute inset-0 rounded-rounded transition-transform duration-300"
            alt="Main product image"
            fill
            sizes="(max-width: 476px) 140px, (max-width: 768px) 180px, (max-width: 992px) 240px, 400px"
            style={{
              objectFit: "cover",
              transform: isZoomed
                ? `scale(1.7) translate(-${zoomPosition.x}%, -${zoomPosition.y}%)`
                : "scale(1)",
            }}
          />
        )}
      </Container>

      {/* Thumbnail images */}
      <div className="flex gap-x-4">
        {images.map((image, index) => (
          <div
            key={image.id}
            onClick={() => setMainImage(image)}
            className="cursor-pointer relative aspect-[29/34] w-20 h-20 overflow-hidden bg-ui-bg-subtle"
          >
            {!!image.url && (
              <Image
                src={image.url}
                alt={`Thumbnail image ${index + 1}`}
                fill
                sizes="80px"
                className="absolute inset-0 rounded-rounded"
                style={{ objectFit: "cover" }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ImageGallery

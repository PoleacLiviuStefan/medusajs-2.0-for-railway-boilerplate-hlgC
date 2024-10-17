'use client'
import React, { useRef, useEffect } from 'react';
import Benefit from './Benefit';

const BenefitList = () => {
  const sliderRef = useRef(null);

  useEffect(() => {
    const autoScroll = () => {
      if (sliderRef.current) {
        // Verifică dacă slider-ul a ajuns la capăt și revine la început
        if (sliderRef.current.scrollLeft + sliderRef.current.clientWidth >= sliderRef.current.scrollWidth) {
          sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Derulează câte un singur element Benefit (150px)
          sliderRef.current.scrollBy({ left: 166 , behavior: 'smooth' }); // 150px (lățimea unui element) + 8px (spațiul dintre elemente)
        }
      }
    };

    const interval = setInterval(autoScroll, 3000); // Derulează la fiecare 3 secunde
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='w-full h-[300px] flex flex-col items-center overflow-hidden'>
      <div
        ref={sliderRef}
        className='flex overflow-x-scroll no-scrollbar w-full gap-[16px] whitespace-nowrap max-w-[980px] h-full' // Folosim gap-2 pentru un spațiu mic între elemente

      >
       
          <div
            className='flex-shrink-0' // Asigură-te că elementul nu se micșorează
            style={{ width: '150px' }} // Setează lățimea fiecărui element la 150px
          >
            <Benefit />
          </div>
          <div
            className='flex-shrink-0' // Asigură-te că elementul nu se micșorează
            style={{ width: '150px' }} // Setează lățimea fiecărui element la 150px
          >
            <Benefit />
          </div>
          <div
            className='flex-shrink-0' // Asigură-te că elementul nu se micșorează
            style={{ width: '150px' }} // Setează lățimea fiecărui element la 150px
          >
            <Benefit />
          </div>
          <div
            className='flex-shrink-0' // Asigură-te că elementul nu se micșorează
            style={{ width: '150px' }} // Setează lățimea fiecărui element la 150px
          >
            <Benefit />
          </div>
          <div
            className='flex-shrink-0' // Asigură-te că elementul nu se micșorează
            style={{ width: '150px' }} // Setează lățimea fiecărui element la 150px
          >
            <Benefit />
          </div>
          <div
            className='flex-shrink-0' // Asigură-te că elementul nu se micșorează
            style={{ width: '150px' }} // Setează lățimea fiecărui element la 150px
          >
            <Benefit />
          </div>
          <div
            className='flex-shrink-0' // Asigură-te că elementul nu se micșorează
            style={{ width: '150px' }} // Setează lățimea fiecărui element la 150px
          >
            <Benefit />
          </div>
          <div
            className='flex-shrink-0' // Asigură-te că elementul nu se micșorează
            style={{ width: '150px' }} // Setează lățimea fiecărui element la 150px
          >
            <Benefit />
          </div>
          <div
            className='flex-shrink-0' // Asigură-te că elementul nu se micșorează
            style={{ width: '150px' }} // Setează lățimea fiecărui element la 150px
          >
            <Benefit />
          </div>
          <div
            className='flex-shrink-0' // Asigură-te că elementul nu se micșorează
            style={{ width: '150px' }} // Setează lățimea fiecărui element la 150px
          >
            <Benefit />
          </div>
          <div
            className='flex-shrink-0' // Asigură-te că elementul nu se micșorează
            style={{ width: '150px' }} // Setează lățimea fiecărui element la 150px
          >
            <Benefit />
          </div>
     
      </div>
    </div>
  );
};

export default BenefitList;

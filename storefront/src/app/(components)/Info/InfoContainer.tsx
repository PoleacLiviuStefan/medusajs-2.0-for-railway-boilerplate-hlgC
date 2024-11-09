import React from "react"

const InfoContainer = ({ bgColor="[#ffc2ea]", display=null, gridCols, title, description, flexDirection, children }) => {
  return (
    <div className={`${display==="grid" ? `grid grid-cols-${gridCols}` : display} flex-col lg:flex-${flexDirection} items-center p-4 bg-${bgColor} w-full h-[700px] lg:h-[230px] text-center`}>
      {title && <h3 className="font-bold text-[20px] lg:text-[28px]">{title}</h3>}
      {description && <p className="text-[14px] lg:text-[16px]">{description}</p>}
      {children}
    </div>
  )
}

export default InfoContainer

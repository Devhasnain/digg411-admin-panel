import React, { memo } from 'react'

type Props = {
    children:React.ReactNode
}

const Tile = ({children}:Props) => {
  return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        {children}
      </div>
  )
}

export default memo(Tile)
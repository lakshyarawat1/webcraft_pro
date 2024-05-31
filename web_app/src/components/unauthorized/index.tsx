import Link from 'next/link'
import React from 'react'

const Unauthorized = () => {
  return (
    <div className='p-4 text-center h-screen w-screen flex justify-center items-center flex-col' >
        <h1 className='text-3xl md:text-6xl'>
            Unauthorized Access
          </h1>
          <p>
              You do not have access to this part of the website !
          </p>
          <Link href="/" className='mt-4 bg-primary p-2'>
              Back To Home
          </Link>
    </div>
  )
}

export default Unauthorized
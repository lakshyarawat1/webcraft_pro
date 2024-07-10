'use client'

import MediaComponent from '@/components/media'
import { getMedia } from '@/lib/queries'
import { GetMediaFiles } from '@/lib/types'
import React, { useEffect } from 'react'

type Props = {
    subAccountId: string,
}

const MediaBucketTab = (props: Props) => {

    const [data, setData] = React.useState<GetMediaFiles>(null)

    useEffect(() => {
        const fetchData = async () => {
            const res = await getMedia(props.subAccountId)
            setData(res)
        }
        fetchData()
    },[props.subAccountId])

  return (
      <div className='h-[900px] overflow-scroll p-4'>
          <MediaComponent data={data} subAccountId={props.subAccountId}  />
    </div>
  )
}

export default MediaBucketTab
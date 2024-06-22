'use client'

import { useModal } from '@/providers/model-provider'
import React from 'react'
import { Button } from '../ui/button'
import CustomModal from '../global/CustomModal'
import UploadMediaForm from '../forms/UploadMedia'

type Props = {
    subAccountId: string
}

const MediaUploadButton = ({ subAccountId }: Props) => {

    const { isOpen, setOpen, setClose } = useModal()

  return (
      <Button onClick={() => {
          setOpen(<CustomModal title='Upload media' subHeading='Upload a file to your media bucket'>
              <UploadMediaForm subAccountId={subAccountId}></UploadMediaForm>
          </CustomModal>)
    }}>Upload</Button>
  )
}

export default MediaUploadButton
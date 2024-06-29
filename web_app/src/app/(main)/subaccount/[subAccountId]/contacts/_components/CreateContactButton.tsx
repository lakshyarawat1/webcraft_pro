'use client'

import ContactUserForm from '@/components/forms/ContactUserForm'
import CustomModal from '@/components/global/CustomModal'
import { Button } from '@/components/ui/button'
import { useModal } from '@/providers/model-provider'
import React from 'react'

type Props = {
    subAccountId : string
}

const CreateContactButton = ({subAccountId}: Props) => {

    const { setOpen  } = useModal()

    const handleCreateContact = async () => {
        setOpen(
            <CustomModal
                title="Create or update Contact Information"
                subHeading='Contacts are like customers'
            >
                <ContactUserForm subAccountId={subAccountId} />
            </CustomModal>
        )
    }

  return (
    <Button onClick={handleCreateContact}>Create Contact +</Button>
  )
}

export default CreateContactButton
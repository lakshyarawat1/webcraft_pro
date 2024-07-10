import { db } from '@/lib/db'
import EditorProvider from '@/providers/editor/EditorProvider'
import { redirect } from 'next/navigation'
import React from 'react'
import FunnelEditorNavigation from './_components/FunnelEditorNavigation'
import FunnelEditorSidebar from './_components/funnelEditorSidebar'

type Props = {
  params: {
    subAccountId: string,
    funnelId: string,
    funnelPageId: string
  }
}

const page = async ({ params }: Props) => {

  const funnelPageDetails = await db.funnelPage.findFirst({
    where: {
      id: params.funnelPageId
    },
  })
  if (!funnelPageDetails) {
    return redirect(`/subaccount/${params.subAccountId}/funnels/${params.funnelId}`)
  }

  return (
    <div className='fixed right-0 left-0 top-0 bottom-0 z-[20] bg-background overflow-hidden'>
      <EditorProvider
        subAccountId={params.subAccountId}
        funnelId={params.funnelId}
        pageDetails={funnelPageDetails}
      >
        <FunnelEditorNavigation
          subAccountId={params.subAccountId}
          funnelId={params.funnelId}
          funnelPageDetails={funnelPageDetails}
        />
        <FunnelEditorSidebar subAccountId={params.subAccountId} />
      </EditorProvider>
    </div>
  )
}

export default page
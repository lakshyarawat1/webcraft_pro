import BlurPage from '@/components/global/BlurPage'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getFunnel } from '@/lib/queries'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'
import FunnelSettings from './_components/FunnelSettings'
import FunnelSteps from './_components/FunnelSteps'

type Props = {
    params: {
        funnelId: string,
        subAccountId: string
    }
}

const page = async ({ params }: Props) => {

    const funnelPages = await getFunnel(params.funnelId)

    if (!funnelPages) return redirect(`/subaccount/${params.subAccountId}/funnels`)
    
    

  return (
    <BlurPage>
      <Link
        href={`/subaccount/${params.subAccountId}/funnels`}
        className="flex justify-between gap-4 mb-4 text-muted-foreground"
      >
        Back
      </Link>
      <h1 className="text-3xl mb-8 ">{funnelPages.name}</h1>
      <Tabs defaultValue="steps" className="w-full">
        <TabsList className="grid  grid-cols-2 w-[50%] bg-transparent ">
          <TabsTrigger value="steps">Steps</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="steps">
          <FunnelSteps
            funnel={funnelPages}
            subAccountId={params.subAccountId}
            pages={funnelPages.FunnelPages}
            funnelId={params.funnelId}
          />
        </TabsContent>
        <TabsContent value="settings">
          <FunnelSettings
            subaccountId={params.subAccountId}
            defaultData={funnelPages}
          />
        </TabsContent>
      </Tabs>
    </BlurPage>
  );
}

export default page
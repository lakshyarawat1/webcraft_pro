import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { db } from '@/lib/db'
import { getLanesWithTicketAndTags, getPipeLineDetails, updateLanesOrder, updateTicketOrder } from '@/lib/queries'
import { LaneDetail } from '@/lib/types'
import { redirect } from 'next/navigation'
import React from 'react'
import PipelineInfobar from '../_components/PipelineInfobar'
import PipelineView from '../_components/PipelineView'
import PipelineSettings from '../_components/PipelineSettings'

type Props = {
    params: {
        pipelineId: string,
        subAccountId: string,
    }
}

const page = async ({ params }: Props) => {
    
    const pipelineDetails = await getPipeLineDetails(params.pipelineId)

    if (!pipelineDetails) return redirect(`/subaccount/${params.subAccountId}/pipelines`)
    
    const pipelines = await db.pipeline.findMany({
        where: {
            subAccountId: params.subAccountId
        }
    })

    const lanes = (await getLanesWithTicketAndTags(
        params.pipelineId
  )) as LaneDetail[]
  
  

    return (
      <Tabs defaultValue="view" className="w-full">
        <TabsList className="bg-transparent border-b-2 h-16 w-full justify-between mb-4">
          <PipelineInfobar
            subAccountId={params.subAccountId}
            pipelineId={params.pipelineId}
            pipelines={pipelines}
          />
          <div>
            <TabsTrigger value="view">Pipeline View</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </div>
        </TabsList>
        <TabsContent value="view">
          <PipelineView
            lanes={lanes}
            pipelineDetails={pipelineDetails}
            pipelineId={params.pipelineId}
            subAccountId={params.subAccountId}
            updateLanesOrder={updateLanesOrder}
            updateTicketsOrder={updateTicketOrder}
          />
        </TabsContent>
        <TabsContent value="settings">
          <PipelineSettings
            subAccountId={params.subAccountId}
            pipelineId={params.pipelineId}
            pipelines={pipelines}
          />
        </TabsContent>
      </Tabs>
    );
}

export default page